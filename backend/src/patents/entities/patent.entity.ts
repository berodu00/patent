import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { InternationalApplication } from './international-application.entity';
import { CostItem } from './cost-item.entity';
import { Attachment } from './attachment.entity';

export enum PatentStatus {
  PREPARING = 'PREPARING',
  APPROVED = 'APPROVED',
  APPLIED = 'APPLIED',
  PUBLISHED = 'PUBLISHED',
  EXAMINING = 'EXAMINING',
  REGISTERED = 'REGISTERED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

@Entity('patents')
export class Patent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, name: 'application_number' })
  applicationNumber: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', name: 'application_date' })
  applicationDate: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'registration_date' })
  registrationDate: Date;

  @Column({
    type: 'enum',
    enum: PatentStatus,
    default: PatentStatus.PREPARING,
  })
  status: PatentStatus;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'applicant_id' })
  applicant: User;

  @OneToMany(() => InternationalApplication, (ia) => ia.patent)
  internationalApplications: InternationalApplication[];

  @OneToMany(() => CostItem, (cost) => cost.patent)
  costItems: CostItem[];

  @OneToMany(() => Attachment, (attachment) => attachment.patent)
  attachments: Attachment[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
}
