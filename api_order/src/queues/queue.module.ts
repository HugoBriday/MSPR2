import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { OrdersModule } from '../orders/orders.module';
import { ProducerService } from './producer.service'

@Module({
    providers: [ConsumerService, ProducerService],
    imports: [OrdersModule],
})
export class QueueModule {}