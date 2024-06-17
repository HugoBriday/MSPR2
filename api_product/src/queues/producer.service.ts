import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';
import { ProductEntity } from '../products/entities/product.entity';

@Injectable()
export class ProducerService {
  private channelWrapperOrderError: ChannelWrapper;
  private channelWrapperOrderAck: ChannelWrapper;

  constructor() {
    const connection = amqp.connect(['amqp://rabbitmq:5672']);

    this.channelWrapperOrderError = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('orderError', { durable: true });
      },
    });
    
    this.channelWrapperOrderAck = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('orderAck', { durable: true });
      },
    });
  }
  
  async addOrderErrorToQueue(id: number) {
    try {
      await this.channelWrapperOrderError.sendToQueue(
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

  // user + product entity
  async addOrderAckToQueue(id: number) {
    try {
      await this.channelWrapperOrderAck.sendToQueue(
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
}