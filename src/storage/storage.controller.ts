import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadDto, UploadResponseDto } from './dto/upload.dto';
import * as fs from 'fs';
import { StorageService } from './storage.service';
import { ComputeService } from 'src/compute/compute.service';
import { multerConfig } from 'src/config/upload.config';

@Controller('storage')
export class StorageController {

    constructor(
        private storageService: StorageService,
        private computeService: ComputeService
    ) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', multerConfig))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() uploadDto: UploadDto
     ): Promise<UploadResponseDto> {
        try {
            if (!file) {
                throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
            }

            const { rootHash } = await this.storageService.uploadFile(file.path);
            const fileContent = fs.readFileSync(file.path, 'utf-8');
            const summary = await this.computeService.summarize(fileContent, file.originalname);

            fs.unlinkSync(file.path);

            return {
                success: true,
                rootHash: rootHash as string,
                summary: summary,
                message: 'File stored on 0G Storage and recorded on chain'
            };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
