import { ApiProperty } from '@nestjs/swagger';
import { Company } from '@prisma/client';

export class CompanyEntity implements Company {
    @ApiProperty()
    id: number;
    
    @ApiProperty()
    companyName: string;
}