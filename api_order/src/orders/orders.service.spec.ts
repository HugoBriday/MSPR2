import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { ProducerService } from '../queues/producer.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersController } from './orders.controller';
import { OrderEntity } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from '@prisma/client';
import { UpdateOrderDto } from './dto/update-order.dto';

/*const createOrderDto: CreateOrderDto = {
  customerId: 1,
  productId: 1,
  amount: 1,
};
const createdOrder: OrderEntity = {
  id: 1,
  createdAt: new Date(),
  customerId: 1,
  productId: 1,
  amount: 1,
  status: false
};

const mockProducerService = {
  addOrderToQueue: jest.fn(),
};

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: PrismaService;
  let producerService: ProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        PrismaService,
        ProducerService
      ],imports:[PrismaService]
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    producerService = module.get<ProducerService>(ProducerService);
    prisma = module.get<PrismaService>(PrismaService);

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order and add it to the queue', async () => {
      const createOrderDto: CreateOrderDto = {
        customerId: 1,
        productId: 1,
        amount: 1,
      };

      const createdOrder: OrderEntity = {
        id: 1,
        createdAt: new Date(),
        customerId: 1,
        productId: 1,
        amount: 1,
        status: false
      };

      jest.spyOn(prisma.order, 'create').mockResolvedValue(createdOrder);

      const result = await service.create(createOrderDto);
      
      expect(result).toEqual(createdOrder);
    }, 60 * 1000);
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const orders: OrderEntity[] = [{
        id: 1,
        createdAt: new Date(),
        customerId: 1,
        productId: 1,
        amount: 1,
        status: false
      },{
        id: 2,
        createdAt: new Date(),
        customerId: 2,
        productId: 2,
        amount: 2,
        status: false
      }];

      jest.spyOn(prisma.order, 'findMany').mockResolvedValue(orders);

      const result = await service.findAll();

      expect(result).toEqual(orders);
    });
  });

  describe('findOne', () => {
    it('should return a single order by id', async () => {
      const order: OrderEntity = {
        id: 1,
        createdAt: new Date(),
        customerId: 1,
        productId: 1,
        amount: 1,
        status: false
      };
      const id = 1;

      jest.spyOn(prisma.order, 'findUnique').mockResolvedValue(order);

      const result = await service.findOne(id);

      expect(result).toEqual(order);
    });
  });

  describe('update', () => {
    it('should update an order and add it to the queue', async () => {
      const updateOrderDto: UpdateOrderDto = {
        customerId: 1,
        productId: 1,
        amount: 2,
      };
      const updatedOrder: OrderEntity = {
        id: 1,
        createdAt: new Date(),
        customerId: 1,
        productId: 1,
        amount: 2,
        status: false
      };
      const id = 1;

      jest.spyOn(prisma.order, 'update').mockResolvedValue(updatedOrder);

      const result = await service.findOne(id);

      expect(result).toEqual(updatedOrder);
    });
  });

  describe('remove', () => {
    it('should delete an order by id', async () => {
      jest.spyOn(prisma.order, 'delete').mockResolvedValue(createdOrder);

      const result = await service.remove(1);

      expect(result).toEqual(createdOrder);
    });
  });
});
*/