import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CustomersModule } from './customers/customers.module';
import { QueueModule } from './queues/queue.module'

@Module({
  imports: [PrismaModule, CustomersModule, QueueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
