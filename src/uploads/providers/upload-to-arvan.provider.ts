import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { generateFileName } from '../helper/uploads.helper';
@Injectable()
export class UploadToArvanProvider {
  private readonly s3: S3Client;
  private readonly bucketName: string;
  private readonly endpoint: string;
  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>(
      'appConfig.arvanBucketName',
    )!;
    this.endpoint = this.configService.get<string>('appConfig.arvanEndpoint')!;
    const accessKeyId = this.configService.get<string>(
      'appConfig.arvanAccessKey',
    )!;
    const secretAccessKey = this.configService.get<string>(
      'appConfig.arvanSecretKey',
    )!;

    this.s3 = new S3Client({
      region: 'default',
      endpoint: this.endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    });
  }
  public async fileUpload(file: Express.Multer.File) {
    const fileName = generateFileName(file);
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
    });

    try {
      await this.s3.send(command);
      const location = `${this.endpoint}/${this.bucketName}/${fileName}`;

      console.log(`Location :${location}`);

      return { Key: fileName, Location: location };
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }
}
