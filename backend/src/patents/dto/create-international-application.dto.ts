import { IsString, IsNotEmpty, IsOptional, IsNumber, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInternationalApplicationDto {
    @ApiProperty({ example: 'US' })
    @IsString()
    @Length(2, 2)
    countryCode: string;

    @ApiProperty({ example: 'United States' })
    @IsString()
    @IsNotEmpty()
    countryName: string;

    @ApiPropertyOptional({ example: 'US-2024-123456' })
    @IsString()
    @IsOptional()
    applicationNumber?: string;

    @ApiProperty({ example: 'APPLIED' })
    @IsString()
    @IsNotEmpty()
    status: string;

    @ApiPropertyOptional({ example: 0 })
    @IsNumber()
    @IsOptional()
    totalCost?: number;
}
