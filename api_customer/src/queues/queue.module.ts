import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { CustomersModule } from '../customers/customers.module';
import { ProducerService } from './producer.service'

@Module({
    providers: [ConsumerService, ProducerService],
    imports: [CustomersModule],
})
export class QueueModule {}