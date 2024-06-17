import { ApiProperty } from "@nestjs/swagger";
import { Product } from "@prisma/client";

export class ProductEntity implements Product {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;
    
    @ApiProperty()
    amount: number;
}