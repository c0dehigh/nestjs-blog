import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './providers/uploads.service';
import { UploadToAwsProvider } from './providers/upload-to-aws.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './upload.entity';
import { UploadToArvanProvider } from './providers/upload-to-arvan.provider';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, UploadToAwsProvider, UploadToArvanProvider],
  imports: [TypeOrmModule.forFeature([Upload])],
})
export class UploadsModule {}
