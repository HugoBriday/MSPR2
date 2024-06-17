import { ApiProperty } from "@nestjs/swagger";
import { Order } from "@prisma/client";
import { Status } from '@prisma/client' 

export class OrderEntity implements Order {
    @ApiProperty()
    id: number;
    
    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    customerId: number;

    @ApiProperty()
    productId:  number;

    @ApiProperty()
    amount:  number;

    @ApiProperty()
    status: Status;
}
