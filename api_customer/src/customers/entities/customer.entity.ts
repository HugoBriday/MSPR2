import { ApiProperty } from "@nestjs/swagger";
import { ProfileEntity } from "./profile.entity";
import { CompanyEntity } from "./comapany.entity";
import { AddressEntity } from "./address.entity";

// implements Customer
export class CustomerEntity {
    @ApiProperty()
    id: number;
    
    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    name: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    address: AddressEntity;

    @ApiProperty()
    company: CompanyEntity;

    @ApiProperty()
    profile: ProfileEntity;
}
