import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { CustomersService } from '../customers/customers.service';
import { OrderEntity } from '../orders/order.entity'
import { Customer } from '@prisma/client';
import { ProducerService } from './producer.service';

@Injectable()
export class ConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(ConsumerService.name);
  constructor(
    private custmersService: CustomersService,
    private producerService: ProducerService
  ) {
    const connection = amqp.connect(['amqp://rabbitmq:5672']);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue('newOrderQueue', { durable: true });
        await channel.consume('newOrderQueue', async (message) => {
          if (message) {
            const order: OrderEntity = JSON.parse(message.content.toString());
            this.logger.log('Received new order:', order);
            //await this.custmersService.sendEmail(content);
            const customer: Customer = await this.custmersService.findOne(order.customerId);
            if (customer === null) {
              this.logger.error(`no customer with ID ${order.customerId}`);

              await this.producerService.addOrderErrorToQueue(order.id);

              channel.nack(message, false, false) // avoid requeue
              return;
            }

            await this.producerService.addOrderAckToQueue(order.id);
            channel.ack(message);
          }
        });
      });
      this.logger.log('Consumer service started and listening for messages.');
    } catch (err) {
      this.logger.error('Error starting the consumer:', err);
    }
  }

  async waitForProductResponse(correlationId: String) {

    /*await this.channelWrapper.assertQueue(requestQueue, { durable: false });
        
    // Assurer que la file d'attente de réponses existe
    await channel.assertQueue(responseQueue, { durable: false });

    return await new Promise((resolve, reject) => {
      this.channel.consume(responseQueue, (msg) => {
          if (msg.properties.correlationId === correlationId) {
              resolve(JSON.parse(msg.content.toString()));
              channel.ack(msg);
          }
      }, { noAck: false });

      // Envoyer le message de requête avec l'ID produit
      const message = JSON.stringify({ productId: id });
      channel.sendToQueue(requestQueue, Buffer.from(message), {
          correlationId: correlationId,
          replyTo: responseQueue
      });*/
  }
}
