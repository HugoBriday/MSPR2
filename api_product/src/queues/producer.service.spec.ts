import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';
import { OrderEntity } from '../orders/entities/order.entity';
import { OrdersModule } from '../orders/orders.module'
import * as amqp from 'amqp-connection-manager';
import { PrismaService } from '../prisma/prisma.service';
import { mocked } from "jest-mock";

// Créer un mock pour amqp
/*jest.mock('amqp-connection-manager');
const mockedAmqp = mocked(amqp, true);


const order: OrderEntity = {
    id: 1,
    createdAt: new Date(),
    customerId: 1,
    productId: 2,
    amount: 2,
    status: false
};*/

describe('ProducerService', () => {
    let service: ProducerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProducerService, PrismaService],
            imports: [ OrdersModule ]
        }).compile();

        service = module.get<ProducerService>(ProducerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
      });
    
      /*it('should add order to queue', async () => {
    
        const mockChannelWrapperCustomer = {
          sendToQueue: jest.fn(),
          close: jest.fn(), // Mock close method
        };
    
        // Simuler la création du canal
        mockedAmqp.connect.mockReturnValue({
          createChannel: jest.fn(() => mockChannelWrapperCustomer),
        });
    
        await service.addOrderToQueue(order);
    
        expect(mockChannelWrapperCustomer.sendToQueue).toHaveBeenCalledWith(
          'newOrderQueue',
          expect.any(Buffer),
          { persistent: true }
        );
    
        // Nettoyer le canal à la fin du test
        expect(mockChannelWrapperCustomer.close).toHaveBeenCalled();
      });
    
      it('should throw internal server error on failure to send order', async () => {
    
        const mockChannelWrapperCustomer = {
          sendToQueue: jest.fn().mockRejectedValueOnce(new Error('Failed to send')),
          close: jest.fn(), // Mock close method
        };
    
        // Simuler la création du canal
        mockedAmqp.connect.mockReturnValue({
          createChannel: jest.fn(() => mockChannelWrapperCustomer),
        });
    
        await expect(service.addOrderToQueue(order)).rejects.toThrowError(
          new HttpException('Error unable to send order', HttpStatus.INTERNAL_SERVER_ERROR)
        );
    
        // Nettoyer le canal à la fin du test
        expect(mockChannelWrapperCustomer.close).toHaveBeenCalled();
      });*/
    });