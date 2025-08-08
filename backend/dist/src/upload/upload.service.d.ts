import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private configService;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    deleteFile(fileUrl: string): Promise<void>;
}
