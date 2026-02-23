import { IsNotEmpty, IsString } from "class-validator";

export class UploadDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    author: string;

    @IsString()
    @IsNotEmpty()
    category: string;
}

export class UploadResponseDto {
    success: boolean;
    rootHash: string;
    summary: string;
    message: string;
}