import { PartialType } from '@nestjs/swagger';
import { CreatePatentDto } from './create-patent.dto';

export class UpdatePatentDto extends PartialType(CreatePatentDto) { }
