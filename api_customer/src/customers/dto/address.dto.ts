import { ApiProperty } from '@nestjs/swagger';

export class AddressDto {
    @ApiProperty()
    postalCode: string;

    @ApiProperty()
    city: string;
}