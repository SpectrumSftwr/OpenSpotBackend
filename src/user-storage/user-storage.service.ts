import { Injectable } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Config } from './s3.config';

@Injectable()
export class UserStorageService {
  private s3 = new S3Client({ region: s3Config.region });

  async getSignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: s3Config.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3, command, {
      expiresIn: 3600, // 1 hour
    });
  }

  /**
   * Uploads an Image to the S3 Bucket.
   */
  async uploadImage(file: Express.Multer.File, location: string) {
    const key = `${location}/${file.originalname}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: s3Config.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return key; 
  }
}
