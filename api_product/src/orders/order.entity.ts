import { ApiProperty } from "@nestjs/swagger";

export class OrderEntity {
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
    status: boolean;
}
