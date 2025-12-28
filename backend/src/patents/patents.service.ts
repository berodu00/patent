import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatentDto } from './dto/create-patent.dto';
import { UpdatePatentDto } from './dto/update-patent.dto';
import { Patent, PatentStatus } from './entities/patent.entity';
import { User } from '../users/entities/user.entity';
import { InternationalApplication } from './entities/international-application.entity';
import { CreateInternationalApplicationDto } from './dto/create-international-application.dto';
import { CostItem } from './entities/cost-item.entity';
import { CreateCostItemDto } from './dto/create-cost-item.dto';
import { Attachment } from './entities/attachment.entity';
import { StorageService } from './storage.service';
import { KiprisService } from '../integrations/kipris/kipris.service';

@Injectable()
export class PatentsService {
    constructor(
        @InjectRepository(Patent)
        private patentsRepository: Repository<Patent>,
        @InjectRepository(InternationalApplication)
        private iaRepository: Repository<InternationalApplication>,
        @InjectRepository(CostItem)
        private costRepository: Repository<CostItem>,
        @InjectRepository(Attachment)
        private attachmentRepository: Repository<Attachment>,
        private storageService: StorageService,
        private kiprisService: KiprisService,
    ) { }

    async create(createPatentDto: CreatePatentDto, user: User): Promise<Patent> {
        const patent = this.patentsRepository.create({
            ...createPatentDto,
            applicant: user,
        });
        return this.patentsRepository.save(patent);
    }

    async findAll(query: { page?: number; limit?: number; search?: string; status?: string }): Promise<{ data: Patent[]; total: number }> {
        const { page = 1, limit = 10, search, status } = query;
        const qb = this.patentsRepository.createQueryBuilder('patent')
            .leftJoinAndSelect('patent.applicant', 'applicant')
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('patent.created_at', 'DESC');

        if (search) {
            qb.andWhere('(patent.title LIKE :search OR patent.applicationNumber LIKE :search)', { search: `%${search}%` });
        }

        if (status) {
            qb.andWhere('patent.status = :status', { status });
        }

        const [data, total] = await qb.getManyAndCount();
        return { data, total };
    }

    async findOne(id: string): Promise<Patent> {
        const patent = await this.patentsRepository.findOne({
            where: { id },
            relations: ['applicant', 'internationalApplications'],
        });

        if (!patent) {
            throw new NotFoundException(`Patent with ID ${id} not found`);
        }

        return patent;
    }

    async update(id: string, updatePatentDto: UpdatePatentDto): Promise<Patent> {
        const patent = await this.findOne(id);
        Object.assign(patent, updatePatentDto);
        return this.patentsRepository.save(patent);
    }

    async remove(id: string): Promise<void> {
        const result = await this.patentsRepository.softDelete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Patent with ID ${id} not found`);
        }
    }

    // International Applications
    async addInternationalApplication(patentId: string, dto: CreateInternationalApplicationDto): Promise<InternationalApplication> {
        const patent = await this.findOne(patentId);
        const ia = this.iaRepository.create({
            ...dto,
            patent,
        });
        return this.iaRepository.save(ia);
    }

    async getInternationalApplications(patentId: string): Promise<InternationalApplication[]> {
        return this.iaRepository.find({
            where: { patent: { id: patentId } },
            order: { created_at: 'DESC' },
        });
    }

    async removeInternationalApplication(iaId: string): Promise<void> {
        const result = await this.iaRepository.delete(iaId);
        if (result.affected === 0) {
            throw new NotFoundException(`International Application with ID ${iaId} not found`);
        }
    }

    // Cost Management
    async addCostItem(patentId: string, dto: CreateCostItemDto): Promise<CostItem> {
        const patent = await this.findOne(patentId);
        const cost = this.costRepository.create({
            ...dto,
            patent,
        });
        return this.costRepository.save(cost);
    }

    async getCostItems(patentId: string): Promise<CostItem[]> {
        return this.costRepository.find({
            where: { patent: { id: patentId } },
            order: { created_at: 'DESC' },
        });
    }

    async removeCostItem(costId: string): Promise<void> {
        const result = await this.costRepository.delete(costId);
        if (result.affected === 0) {
            throw new NotFoundException(`Cost Item with ID ${costId} not found`);
        }
    }

    // File Management
    async addAttachment(patentId: string, file: Express.Multer.File, user: User): Promise<Attachment> {
        const patent = await this.findOne(patentId);
        const attachment = this.attachmentRepository.create({
            fileName: file.originalname,
            filePath: file.path,
            fileSize: file.size,
            uploadedBy: user,
            patent,
        });
        return this.attachmentRepository.save(attachment);
    }

    async getAttachments(patentId: string): Promise<Attachment[]> {
        return this.attachmentRepository.find({
            where: { patent: { id: patentId } },
            relations: ['uploadedBy'],
            order: { created_at: 'DESC' },
        });
    }

    async getAttachment(attId: string): Promise<Attachment> {
        const attachment = await this.attachmentRepository.findOne({ where: { id: attId } });
        if (!attachment) throw new NotFoundException('Attachment not found');
        return attachment;
    }

    async removeAttachment(attId: string): Promise<void> {
        const attachment = await this.getAttachment(attId);
        // Remove file from disk
        this.storageService.deleteFile(attachment.filePath);
        await this.attachmentRepository.remove(attachment);
    }

    // External Integration
    async syncWithKipris(patentId: string): Promise<Patent> {
        const patent = await this.findOne(patentId);

        try {
            const kiprisData = await this.kiprisService.searchByApplicationNumber(patent.applicationNumber);

            // Map KIPRIS data to Patent Entity
            // Note: KIPRIS structure varies, this is a simplified mapping based on our Mock
            // Real implementation would require robust XML parsing validation

            // Adjust mapping based on actual KIPRIS/Mock response structure
            const item = kiprisData?.response?.body?.items?.biblioSummaryInfo;

            if (item) {
                // Determine status mapping
                let status = patent.status;
                if (item.registerStatus === 'Registered') status = PatentStatus.REGISTERED;
                if (item.registerStatus === 'Reject') status = PatentStatus.REJECTED;
                // ... more mappings

                // Update fields
                const updateData: Partial<Patent> = {
                    title: item.inventionTitle || patent.title,
                    status: status,
                    // If dates differ...
                };

                await this.patentsRepository.update(patentId, updateData);
                return this.findOne(patentId);
            }

            return patent;
        } catch (error) {
            console.error(`Sync failed for ${patent.applicationNumber}:`, error);
            throw new Error('KIPRIS Sync Failed');
        }
    }
}
