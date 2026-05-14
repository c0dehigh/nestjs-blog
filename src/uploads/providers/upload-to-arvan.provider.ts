import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { generateFileName } from '../helper/uploads.helper';
@Injectable()
export class UploadToArvanProvider {
  private readonly s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: 'default',
      endpoint: this.configService.get<string>('appConfig.arvanEndpoint')!,
      credentials: {
        accessKeyId: this.configService.get<string>(
          'appConfig.arvanAccessKey',
        )!,
        secretAccessKey: this.configService.get<string>(
          'appConfig.arvanSecretKey',
        )!,
      },
      forcePathStyle: true,
    });
  }
  public async fileUpload(file: Express.Multer.File) {
    const fileName = generateFileName(file);
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('appConfig.arvanBucketName')!,
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
    });

    try {
      await this.s3.send(command);
      const location = `${this.configService.get<string>('appConfig.arvanEndpoint')!}/${this.configService.get<string>('appConfig.arvanBucketName')!}/${fileName}`;

      return { Key: fileName, Location: location };
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }
}
