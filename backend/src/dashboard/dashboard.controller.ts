import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('statistics')
    @ApiOperation({ summary: 'Get overall statistics' })
    getStatistics() {
        return this.dashboardService.getStatistics();
    }

    @Get('trends')
    @ApiOperation({ summary: 'Get application trends' })
    getTrends() {
        return this.dashboardService.getTrends();
    }
}
