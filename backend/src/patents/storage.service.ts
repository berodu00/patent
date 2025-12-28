import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StorageService {
    private readonly uploadDir = 'uploads';

    constructor() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    saveFile(file: Express.Multer.File): string {
        // Generate unique filename to avoid collisions?
        // User might want to keep original name but with timestamp or uuid.
        // For now, let's just use the file.path if Multer saved it there, OR move it.
        // Multer with 'dest' option in module config saves to disk automatically. 
        // We will assume Multer saves to temporary or direct uploads.
        // Actually, if we use FileInterceptor without diskStorage options, it keeps in memory.
        // Let's implement writing buffer to disk if memory storage, OR just rename/move if disk storage.
        // We'll trust the controller to configure Multer correctly or pass the file object.

        // Simplest: Controller passes file, if it's already on disk (via Multer local storage config), return path.
        // If we want to manage it here:

        // But let's assume we want to centralize logic.
        // Let's assume Multer is configured to save to `uploads/`.
        // Then we just return the filename/path.

        // However, if we want to support MinIO later, we should take the buffer/stream.
        // For MVP local disk:
        return file.path; // Assuming Multer saved it.
    }

    deleteFile(filePath: string): void {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    getFilePath(fileName: string): string {
        return path.join(this.uploadDir, fileName);
    }
}
