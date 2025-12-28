import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatentsService } from './patents.service';
import { PatentsController } from './patents.controller';
import { Patent } from './entities/patent.entity';
import { InternationalApplication } from './entities/international-application.entity';
import { CostItem } from './entities/cost-item.entity';
import { Attachment } from './entities/attachment.entity';
import { StorageService } from './storage.service';
import { MulterModule } from '@nestjs/platform-express';
import { KiprisModule } from '../integrations/kipris/kipris.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Patent, InternationalApplication, CostItem, Attachment]),
        MulterModule.register({
            dest: './uploads',
        }),
        KiprisModule,
    ],
    controllers: [PatentsController],
    providers: [PatentsService, StorageService],
    exports: [PatentsService],
})
export class PatentsModule { }
