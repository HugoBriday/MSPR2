import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { ProducerService } from './producer.service';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(ConsumerService.name);
  constructor(
    private ordersService: OrdersService,
    private producerService: ProducerService
  ) {
    const connection = amqp.connect(['amqp://rabbitmq:5672']);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {

    try {
      // order error
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue('orderError', { durable: true });
        await channel.consume('orderError', async (message) => {
          if (message) {
            const orderId: number = JSON.parse(message.content.toString()).id;
            this.logger.log(`Received new order error for ${orderId}`);
            
            await this.ordersService.remove(orderId)

            channel.ack(message);
          }
        });

        // order ack
        await channel.assertQueue('orderAck', { durable: true });
        await channel.consume('orderAck', async (message) => {
          if (message) {
            const orderId: number = JSON.parse(message.content.toString()).id;

            this.logger.log(`Received new order ack for ${orderId}`);

            //this.logger.info()
            this.ordersService.updateStatus(orderId);
            channel.ack(message);
          }
        });

        await channel.assertQueue("ordersResponse", { durable: true });
        await channel.assertQueue("ordersRequest", { durable: true });
        await channel.consume("ordersRequest", async (message) => {
          if (message) {
            const customerId: number = parseInt(JSON.parse(message.content.toString()).customerId);

            this.logger.log(message.properties.correlationId)

            const orders = await this.ordersService.findOrderOfCutomser(customerId);

            // get associated products:
            let products = await this.producerService.askForProducts(orders.map(e => e.productId))
            this.logger.log(products);

            const ordersAndProduct = orders.map((item, index) => {
              const { productId, ...rest } = item;
              return { ...rest, product: products[index] };
            });
            
            await channel.sendToQueue("ordersResponse",
              Buffer.from(JSON.stringify(ordersAndProduct)),
              {
                correlationId: message.properties.correlationId,
                replyTo: "ordersRequest"
              }
            );
            
            channel.ack(message);
          }
        });
      });


      this.logger.log('Consumer service started and listening for messages.');
    } catch (err) {
      this.logger.error('Error starting the consumer:', err);
    }
  }

  // order ack
}
