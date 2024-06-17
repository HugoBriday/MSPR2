import { Injectable, Logger } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ProducerService } from 'src/queues/producer.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService, private producerService: ProducerService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    // split model
    const { address, profile, company, ...customer } = createCustomerDto;

    return await this.prisma.customer.create({
      data: {
        ...customer,
        address: {
          create: address
        },
        profile: {
          create: profile
        },
        company: {
          create: company
        }
      },
      include: {
        address: true,
        profile: true,
        company: true
      }
    });
  }

  findAll() {
    return this.prisma.customer.findMany({
      include: {
        address: true,
        profile: true,
        company: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        address: true,
        profile: true,
        company: true,
      }
    });
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    // split model
    const { address, profile, company, ...customer } = updateCustomerDto;

    return await this.prisma.customer.update({
      where: { id: id },
      data: {
        ...customer,
        address: {
          update: address,
        },
        profile: {
          update: profile,
        },
        company: {
          update: company,
        },
      },
      include: { // Include the modified relations in the returned customer object
        address: true,
        profile: true,
        company: true,
      },
    });
  }

  remove(id: number) {
    return this.prisma.customer.delete({ where: { id } });
  }

  async getOrder(customerId: number) {
    return await this.producerService.askProductsByCustomerId(customerId);
  }
}
