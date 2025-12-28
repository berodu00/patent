import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patent } from '../patents/entities/patent.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Patent])],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
