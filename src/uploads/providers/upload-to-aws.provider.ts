import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateFileName } from '../helper/uploads.helper';
import { S3 } from 'aws-sdk';

@Injectable()
export class UploadToAwsProvider {
  constructor(private readonly configService: ConfigService) {}
  public async fileUpload(file: Express.Multer.File) {
    const s3 = new S3();

    try {
      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get<string>('appConfig.awsBucketName')!,
          Body: file.buffer,
          Key: generateFileName(file),
          ContentType: file.mimetype,
        })
        .promise();

      return uploadResult.Key;
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
  }
}
