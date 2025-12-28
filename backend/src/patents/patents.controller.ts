import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { PatentsService } from './patents.service';
import { CreatePatentDto } from './dto/create-patent.dto';
import { UpdatePatentDto } from './dto/update-patent.dto';
import { CreateInternationalApplicationDto } from './dto/create-international-application.dto';
import { CreateCostItemDto } from './dto/create-cost-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import type { Response } from 'express';

@ApiTags('patents')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('patents')
export class PatentsController {
    constructor(private readonly patentsService: PatentsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new patent' })
    create(@Body() createPatentDto: CreatePatentDto, @Request() req: any) {
        console.log('Creating patent for user:', req.user);
        return this.patentsService.create(createPatentDto, req.user);
    }

    @Get()
    @ApiOperation({ summary: 'List patents' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiQuery({ name: 'status', required: false, type: String })
    findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('search') search?: string,
        @Query('status') status?: string,
    ) {
        return this.patentsService.findAll({ page, limit, search, status });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get patent detail' })
    findOne(@Param('id') id: string) {
        return this.patentsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update patent' })
    update(@Param('id') id: string, @Body() updatePatentDto: UpdatePatentDto) {
        return this.patentsService.update(id, updatePatentDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete patent' })
    remove(@Param('id') id: string) {
        return this.patentsService.remove(id);
    }

    // International Applications
    @Post(':id/international')
    @ApiOperation({ summary: 'Add international application' })
    addInternational(@Param('id') id: string, @Body() dto: CreateInternationalApplicationDto) {
        return this.patentsService.addInternationalApplication(id, dto);
    }

    @Get(':id/international')
    @ApiOperation({ summary: 'Get international applications' })
    getInternationals(@Param('id') id: string) {
        return this.patentsService.getInternationalApplications(id);
    }

    @Delete('international/:iaId')
    @ApiOperation({ summary: 'Remove international application' })
    removeInternational(@Param('iaId') iaId: string) {
        return this.patentsService.removeInternationalApplication(iaId);
    }

    // Cost Management
    @Post(':id/costs')
    @ApiOperation({ summary: 'Add cost item' })
    addCost(@Param('id') id: string, @Body() dto: CreateCostItemDto) {
        return this.patentsService.addCostItem(id, dto);
    }

    @Get(':id/costs')
    @ApiOperation({ summary: 'Get cost items' })
    getCosts(@Param('id') id: string) {
        return this.patentsService.getCostItems(id);
    }

    @Delete('costs/:costId')
    @ApiOperation({ summary: 'Remove cost item' })
    removeCost(@Param('costId') costId: string) {
        return this.patentsService.removeCostItem(costId);
    }

    // File Management
    @Post(':id/attachments')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload attachment' })
    uploadAttachment(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Request() req: any
    ) {
        return this.patentsService.addAttachment(id, file, req.user);
    }

    @Get(':id/attachments')
    @ApiOperation({ summary: 'Get attachments' })
    getAttachments(@Param('id') id: string) {
        return this.patentsService.getAttachments(id);
    }

    @Get('attachments/:attId/download')
    @ApiOperation({ summary: 'Download attachment' })
    async downloadAttachment(@Param('attId') attId: string, @Res() res: Response) {
        const attachment = await this.patentsService.getAttachment(attId);
        res.download(attachment.filePath, attachment.fileName);
    }

    @Delete('attachments/:attId')
    @ApiOperation({ summary: 'Delete attachment' })
    removeAttachment(@Param('attId') attId: string) {
        return this.patentsService.removeAttachment(attId);
    }

    @Post(':id/sync')
    @ApiOperation({ summary: 'Sync with KIPRIS' })
    syncWithKipris(@Param('id') id: string) {
        return this.patentsService.syncWithKipris(id);
    }
}
