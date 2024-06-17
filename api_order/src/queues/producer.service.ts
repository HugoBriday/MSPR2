import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;
  //private channelWrapperProduct: ChannelWrapper;

  constructor() {
    //const connection = amqp.connect(['amqp://rabbitmq:5672']);

    /*this.channelWrapperCustomer = amqp.connect(['amqp://rabbitmq:5672']).createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('newOrderQueue', { durable: true });
      },
    });

    this.channelWrapperProduct = amqp.connect(['amqp://rabbitmq:5672']).createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('newOrderQueueProduct', { durable: true });
      },
    });*/

    this.channelWrapper = amqp.connect(['amqp://rabbitmq:5672']).createChannel({
      setup: (channel: Channel) => {
        channel.assertQueue('newOrderQueue', { durable: true });
        channel.assertQueue('newOrderQueueProduct', { durable: true });
      },
    });
  }

  // user + product entity
  async addOrderToQueue(order: OrderEntity) {
    try {
      // ask ack to customer
      await this.channelWrapper.sendToQueue(
        'newOrderQueue',
        Buffer.from(JSON.stringify(order)),
        { persistent: true }
      );

      // ask ack to product
      await this.channelWrapper.sendToQueue(
        'newOrderQueueProduct',
        Buffer.from(JSON.stringify(order)),
        { persistent: true }
      );

      // send to product microservice
      Logger.log(`Sent new Order to queue, Statut:${order.customerId}`);

      // validate order.
    } catch (error) {
      Logger.log(error);

      throw new HttpException(
        'Error unable to send order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async askForProducts(productsIds: number[]) {
    try {
      const correlationId: string = uuidv4();

      await this.channelWrapper.sendToQueue(
        "productsRequest",
        Buffer.from(JSON.stringify({ productsIds })),
        {
          correlationId: correlationId,
          replyTo: "productsResponse"
        }
      );

      return new Promise(async (resolve, reject) => {        
        const consumerTag = this.channelWrapper.consume("productsResponse", async (msg) => {
          if (correlationId !== msg.properties.correlationId)
    
          await this.channelWrapper.ack(msg);
          resolve(JSON.parse(msg.content.toString()));
          this.channelWrapper.cancel((await consumerTag).consumerTag);
        });
      });
    } catch (error) {
      Logger.log(error);

      throw new HttpException(
        'Error unable to request product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
