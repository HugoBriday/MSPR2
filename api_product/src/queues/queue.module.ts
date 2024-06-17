import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ProductsModule } from '../products/products.module';
import { ProducerService } from './producer.service'

@Module({
    providers: [ConsumerService, ProducerService],
    imports: [ProductsModule],
})
export class QueueModule {}