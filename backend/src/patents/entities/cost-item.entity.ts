import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Patent } from './patent.entity';

@Entity('cost_items')
export class CostItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Patent, (patent) => patent.costItems, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'patent_id' })
    patent: Patent;

    @Column()
    type: string; // e.g., 'APPLICATION_FEE', 'REGISTRATION_FEE'

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @Column({ name: 'due_date', nullable: true })
    dueDate: Date;

    @Column({ name: 'payment_date', nullable: true })
    paymentDate: Date;

    @Column({ default: 'UNPAID' })
    status: string; // 'PAID', 'UNPAID', 'OVERDUE'

    @Column({ type: 'text', nullable: true })
    note: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;
}
