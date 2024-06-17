import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProducerService } from '../queues/producer.service';

@Module({
  controllers: [CustomersController],
  providers: [CustomersService, ProducerService],
  exports: [CustomersService],
  imports: [PrismaModule],
})
export class CustomersModule {}
