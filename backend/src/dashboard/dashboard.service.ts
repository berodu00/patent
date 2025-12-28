import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patent, PatentStatus } from '../patents/entities/patent.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Patent)
        private patentRepository: Repository<Patent>,
    ) { }

    async getStatistics() {
        const total = await this.patentRepository.count();

        const statusCounts = await this.patentRepository
            .createQueryBuilder('patent')
            .select('patent.status', 'status')
            .addSelect('COUNT(patent.status)', 'count')
            .groupBy('patent.status')
            .getRawMany();

        // Convert key-value for easier frontend consumption
        const formattedStatus = statusCounts.reduce((acc, curr) => {
            acc[curr.status] = parseInt(curr.count);
            return acc;
        }, {});

        // Mock Cost Summary (Since we don't have a global cost table easily accessible for sum without join, doing a simple count for now or mock)
        // Ideally: Join with CostItems and sum amount.
        // For MVP: Return Status stats.

        return {
            totalPatents: total,
            statusDistribution: formattedStatus,
        };
    }

    async getTrends() {
        // Mock data for trends (last 6 months)
        // In real app: Group by month of applicationDate
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const data = months.map(m => ({
            name: m,
            applications: Math.floor(Math.random() * 10),
            registrations: Math.floor(Math.random() * 5),
        }));
        return data;
    }
}
