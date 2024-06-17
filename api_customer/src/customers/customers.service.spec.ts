import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { PrismaService } from '../prisma/prisma.service';
import { Customer } from '@prisma/client';
import { CreateCustomerDto } from './dto/create-customer.dto';

const mockCustomerModel: Customer = {
  id: 1,
  createdAt: new Date('2023-08-29T16:28:58.454Z'),
  name: 'Jan Schiller',
  username: 'Kailee.Greenholt73',
  firstName: 'Keven',
  lastName: 'Kris',
  addressId: 1,
  companyId: 1,
  profileId: 1
}

describe('CustomersService', () => {
  let service: CustomersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersService, PrismaService],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new customer', async () => {
      
      jest.spyOn(prismaService.customer, 'create').mockResolvedValue(mockCustomerModel);

      const result = await service.create({
        name: 'Jan Schiller',
        username: 'Kailee.Greenholt73',
        firstName: 'Keven',
        lastName: 'Kris',
        profile: {
          firstName: 'Mitchell',
          lastName: 'Carter'
        },
        address: {
          postalCode: '61432-1180',
          city: 'St. Joseph'
        },
        company: {
          companyName: 'Bechtelar LLC'
        }
      });

      expect(result).toEqual(mockCustomerModel);
    });
  });

  describe('findOne', () => {
    it('should find a customer by ID', async () => {
      jest.spyOn(prismaService.customer, 'findUnique').mockResolvedValue(mockCustomerModel);

      const result = await service.findOne(1);

      expect(result).toEqual(mockCustomerModel);
    });
  });

  describe('findAll', () => {
    it('should find all customers', async () => {
      const mockCustomers: Customer[] = [
        mockCustomerModel,
        {
          id: 2,
          createdAt: new Date('2023-08-29T16:28:58.454Z'),
          name: 'John Doe',
          username: 'John.Doe12',
          firstName: 'John',
          lastName: 'doe',
          addressId: 2,
          companyId: 2,
          profileId: 2
        }
      ];
      jest.spyOn(prismaService.customer, 'findMany').mockResolvedValue(mockCustomers);

      const result = await service.findAll();

      expect(result).toEqual(mockCustomers);
    });
  });

  describe('remove', () => {
    it('should delete a customer by ID', async () => {
      jest.spyOn(prismaService.customer, 'delete').mockResolvedValue(mockCustomerModel);

      const result = await service.remove(1);

      expect(result).toEqual(mockCustomerModel);
    });
  });
});