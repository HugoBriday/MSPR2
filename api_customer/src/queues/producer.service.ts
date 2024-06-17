import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProducerService {
  private channelWrapper: ChannelWrapper;
  /*private channelWrapperOrderError: ChannelWrapper;
  private channelWrapperOrderAck: ChannelWrapper;
  private channelWrapperProductRequest: ChannelWrapper;
  private channelWrapperProductResponse: ChannelWrapper;*/

  constructor() {
    const connection = amqp.connect(['amqp://rabbitmq:5672']);
    this.channelWrapper = connection.createChannel({
      setup: async (channel: Channel) => {
        await channel.assertQueue('orderError', { durable: true });
        await channel.assertQueue('orderAck', { durable: true });
        await channel.assertQueue('productRequest', { durable: true });
        await channel.assertQueue('productResponse', { durable: true });
      },
    });

    /*this.channelWrapperOrderAck = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('orderAck', { durable: true });
      },
    });

    this.channelWrapperProductRequest = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('productRequest', { durable: true });
      },
    });

    this.channelWrapperProductResponse = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('productResponse', { durable: true });
      },
    });*/
  }

  // user + product entity
  async addOrderErrorToQueue(id: number) {
    try {
      await this.channelWrapper.sendToQueue(
        'orderError',
        Buffer.from(JSON.stringify({ id })),
        { persistent: true }
      );
      Logger.log('Sent new Order error to queue');
    } catch (error) {
      Logger.log(error);

      throw new HttpException(
        'Error unable to send order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addOrderAckToQueue(id: number) {
    try {
      await this.channelWrapper.sendToQueue(
        'orderAck',
        Buffer.from(JSON.stringify({ id })),
        { persistent: true }
      );
      Logger.log('Sent new Order ack to queue');
    } catch (error) {
      Logger.log(error);

      throw new HttpException(
        'Error unable to ack order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async askProductsByCustomerId(customerId: number) {
    try {
      const correlationId: string = uuidv4();

      await this.channelWrapper.sendToQueue(
        "ordersRequest",
        Buffer.from(JSON.stringify({ customerId })),
        {
          correlationId: correlationId,
          replyTo: "ordersResponse"
        }
      );

      return new Promise(async (resolve, reject) => {        
        const consumerTag = this.channelWrapper.consume("ordersResponse", async (msg) => {
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