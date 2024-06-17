import { ApiProperty } from '@nestjs/swagger';
import { CompanyDto } from './company.dto';
import { AddressDto } from './address.dto';
import { ProfileDto } from './profile.dto';

export class CreateCustomerDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    address: AddressDto;

    @ApiProperty()
    profile: ProfileDto;

    @ApiProperty()
    company: CompanyDto;
}
