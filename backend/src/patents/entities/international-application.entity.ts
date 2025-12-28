import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Unique } from 'typeorm';
import { Patent } from './patent.entity';

@Entity('international_applications')
@Unique(['patent', 'countryCode'])
export class InternationalApplication {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Patent, (patent) => patent.internationalApplications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'patent_id' })
    patent: Patent;

    @Column({ name: 'country_code', length: 2 })
    countryCode: string;

    @Column({ name: 'country_name' })
    countryName: string;

    @Column({ name: 'application_number', nullable: true })
    applicationNumber: string;

    @Column()
    status: string;

    @Column({ name: 'total_cost', type: 'decimal', precision: 15, scale: 2, default: 0 })
    totalCost: number;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;
}
