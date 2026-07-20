import fs from "node:fs/promises";
import path from "node:path";
import { logger } from "../lib/logger";

export interface StorageUploadOptions {
  filename: string;
  buffer: Buffer;
  contentType?: string;
}

export interface StorageProvider {
  upload(options: StorageUploadOptions): Promise<{ url: string; path: string }>;
  getSignedUrl(filePath: string, expiresSeconds?: number): Promise<string>;
}

class LocalDiskStorageProvider implements StorageProvider {
  private readonly storageDir: string;
  private readonly baseUrl: string;

  constructor() {
    this.storageDir = path.join(process.cwd(), "storage", "screenshots");
    this.baseUrl = process.env.STORAGE_BASE_URL ?? "http://localhost:4000/storage/screenshots";
  }

  async upload({ filename, buffer }: StorageUploadOptions): Promise<{ url: string; path: string }> {
    await fs.mkdir(this.storageDir, { recursive: true });
    const filePath = path.join(this.storageDir, filename);
    await fs.writeFile(filePath, buffer);
    const url = `${this.baseUrl}/${filename}`;
    logger.info({ filename, filePath }, "Screenshot uploaded to local storage");
    return { url, path: filePath };
  }

  async getSignedUrl(filePath: string): Promise<string> {
    const filename = path.basename(filePath);
    return `${this.baseUrl}/${filename}`;
  }
}

export const storageService: StorageProvider = new LocalDiskStorageProvider();
