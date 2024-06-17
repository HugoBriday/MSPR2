import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { OrdersModule } from './orders/orders.module';
import { QueueModule } from './queues/queue.module'

@Module({
  imports: [PrismaModule, OrdersModule, QueueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}