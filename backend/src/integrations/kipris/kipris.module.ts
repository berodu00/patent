import { Module } from '@nestjs/common';
import { KiprisService } from './kipris.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
    providers: [KiprisService],
    exports: [KiprisService],
})
export class KiprisModule { }
