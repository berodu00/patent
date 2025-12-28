import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PatentStatus } from '../entities/patent.entity';

export class CreatePatentDto {
    @ApiProperty({ example: '10-2024-1234567' })
    @IsString()
    @IsNotEmpty()
    applicationNumber: string;

    @ApiProperty({ example: 'Novel Alloy Composition' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional({ example: 'Description of the invention...' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: '2024-01-01T00:00:00Z' })
    @IsDateString()
    @IsNotEmpty()
    applicationDate: string; // ISO Date String

    @ApiPropertyOptional({ enum: PatentStatus, default: PatentStatus.PREPARING })
    @IsEnum(PatentStatus)
    @IsOptional()
    status?: PatentStatus;
}
