import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ProducerService } from '../queues/producer.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, ProducerService, PrismaService],
  exports: [OrdersService]
})
export class OrdersModule {}
