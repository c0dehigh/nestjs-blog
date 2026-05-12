import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { Upload } from '../upload.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UploadFile } from '../interfaces/upload-file.interface';
import { fileTypes } from '../enums/file-types.enum';
import { UploadToArvanProvider } from './upload-to-arvan.provider';

@Injectable()
export class UploadsService {
  constructor(
    /**
     * Inject uploadRepository
     */
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,

    /**
     * Inject uploadToAwsProvider
     */
    private readonly uploadToAwsProvider: UploadToAwsProvider,

    /**
     * Inject uploadToArvanProvider
     */

    private readonly uploadToArvanProvider: UploadToArvanProvider,

    /**
     * Inject configService
     */

    private readonly configService: ConfigService,
  ) {}
  public async uploadFile(file: Express.Multer.File) {
    // Throw an error if the file type is not provided
    if (
      !['image/jpeg', 'image/png', 'image/gif', 'image/jpg'].includes(
        file.mimetype,
      )
    ) {
      throw new BadRequestException('Invalid file type');
    }

    try {
      // Upload to the file to AWS s3
      //   const name = await this.uploadToAwsProvider.fileUpload(file); // for AWS

      const name = await this.uploadToArvanProvider.fileUpload(file); // For Arvan cloud

      // Generate to a new entry in the database
      const uploadFile: UploadFile = {
        name: name.Key,
        path: `${this.configService.get('ARVAN_CLOUDFRONT_URL')}/${name.Key}`,
        type: fileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };

      console.log(uploadFile);

      const upload = this.uploadRepository.create(uploadFile);
      return await this.uploadRepository.save(upload);
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
