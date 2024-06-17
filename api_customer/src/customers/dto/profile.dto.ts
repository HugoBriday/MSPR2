import { ApiProperty } from "@nestjs/swagger";

export class ProfileDto {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;
}
