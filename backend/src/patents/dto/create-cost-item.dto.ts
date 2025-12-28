import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCostItemDto {
    @ApiProperty({ example: 'APPLICATION_FEE' })
    @IsString()
    @IsNotEmpty()
    type: string;

    @ApiProperty({ example: 500000 })
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiPropertyOptional({ example: '2025-12-31' })
    @IsDateString()
    @IsOptional()
    dueDate?: string;

    @ApiPropertyOptional({ example: '2025-12-30' })
    @IsDateString()
    @IsOptional()
    paymentDate?: string;

    @ApiProperty({ example: 'PAID' })
    @IsString()
    @IsNotEmpty()
    status: string;

    @ApiPropertyOptional({ example: 'Initial filing fee' })
    @IsString()
    @IsOptional()
    note?: string;
}
