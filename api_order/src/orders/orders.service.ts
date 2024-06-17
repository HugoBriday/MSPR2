import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ProducerService } from '../queues/producer.service';
import { OrderEntity } from './entities/order.entity';
import { Status } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService, private producerService: ProducerService) {}

  async create(createOrderDto: CreateOrderDto) {
    const order: OrderEntity = await this.prisma.order.create({ data: createOrderDto });
    await this.producerService.addOrderToQueue(order);

    return order;
  }

  async findAll() {
    return await this.prisma.order.findMany()
  }

  findOne(id: number) {
    return this.prisma.order.findUnique({ where: { id } });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {

    const order: OrderEntity = await this.prisma.order.update({
      where: { id },
      data: UpdateOrderDto
    });

    await this.producerService.addOrderToQueue(order);

    return order;
  }

  async updateStatus(id: number) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    let status: Status = Status.NO_ACK;

    if (order.status === Status.NO_ACK) {
      status = Status.WAITING_FOR_ACK;
    } else /*if (order.status === Status.WAITING_FOR_ACK)*/ {
      status = Status.VALIDATED
    } /*else {
      status = Status.VALIDATED
    }*/

    return await this.prisma.order.update({
      where: { id },
      data: { status }
    });
  }

  remove(id: number) {
    return this.prisma.order.delete({ where: { id } });
    // update product
  }

  async findOrderOfCutomser(customerId: number) {
    return await this.prisma.order.findMany({ where: { customerId } });
  }
}
