import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Patent } from './patent.entity';
import { User } from '../../users/entities/user.entity';

@Entity('attachments')
export class Attachment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Patent, (patent) => patent.attachments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'patent_id' })
    patent: Patent;

    @Column({ name: 'file_name' })
    fileName: string;

    @Column({ name: 'file_path' })
    filePath: string;

    @Column({ name: 'file_size', type: 'bigint' })
    fileSize: number;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'uploaded_by' })
    uploadedBy: User;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;
}
