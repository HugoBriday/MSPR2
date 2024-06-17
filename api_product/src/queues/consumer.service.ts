import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { ProducerService } from './producer.service';
import { ProductsService } from '../products/products.service';
import { OrderEntity } from '../orders/order.entity';
import { Product } from '@prisma/client';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(ConsumerService.name);
  constructor(
    private ProductsService: ProductsService,
    private producerService: ProducerService
  ) {
    const connection = amqp.connect(['amqp://rabbitmq:5672']);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue('newOrderQueueProduct', { durable: true });
        await channel.consume('newOrderQueueProduct', async (message) => {
          if (message) {
            const order: OrderEntity = JSON.parse(message.content.toString());
            this.logger.log('Received new order:', order);
            //await this.custmersService.sendEmail(content);
            const product: Product = await this.ProductsService.findOne(order.productId);
            
            // product doesn't exist
            if (product === null) {
              this.logger.error(`no product with ID ${order.customerId}`);

              await this.producerService.addOrderErrorToQueue(order.id);

              channel.nack(message, false, false) // avoid requeue
              return;
            }
            // not enought amount
            if (product.amount < order.amount) {
              this.logger.error(`not enought amount for product with ID ${order.customerId}`);

              await this.producerService.addOrderErrorToQueue(order.id);

              channel.nack(message, false, false) // avoid requeue
              return;
            }

            product.amount -= order.amount;

            this.ProductsService.update(product.id, product)

            await this.producerService.addOrderAckToQueue(order.id);
            channel.ack(message);
          }
        });

        await channel.assertQueue("productsResponse", { durable: true });
        await channel.assertQueue("productsRequest", { durable: true });
        await channel.consume("productsRequest", async (message) => {
          if (message) {

            const productsIds = JSON.parse(message.content.toString()).productsIds;

            this.logger.log(message.properties.correlationId);

            this.logger.log(await this.ProductsService.findOne(productsIds[0]))

            const products = await Promise.all(productsIds.map(async id => await this.ProductsService.findOne(id)));

            this.logger.log(products)

            await channel.sendToQueue("productsResponse",
              Buffer.from(JSON.stringify(products)),
              {
                correlationId: message.properties.correlationId,
                replyTo: "productsRequest"
              }
            );
            
            channel.ack(message);
          }
        });
        this.logger.log('Consumer service started and listening for messages.');
      });
    } catch (err) {
      this.logger.error('Error starting the consumer:', err);
    }
  }
}
