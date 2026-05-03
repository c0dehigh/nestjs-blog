import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Type } from 'class-transformer';
import { postStatus } from '../enums/postStatus.enum';
import { postType } from '../enums/postType.enum';
import { CreatePostMetaOptionsDto } from './create-post-meta-options.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'this is title for blog post',
    example: 'this is title',
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  @MaxLength(512)
  title: string;
  @ApiProperty({
    enum: postType,
    description: "possible values , 'post' , 'page' , 'story', 'series'  ",
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    description: 'this is slug for blog post',
    example: 'this-is-slug',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
  })
  slug: string;
  @ApiProperty({
    enum: postStatus,
    description:
      "possible values , 'draft' , 'scheduled' , 'review', 'published'  ",
  })
  @IsEnum(postStatus)
  @IsNotEmpty()
  status: postStatus;
  @ApiPropertyOptional({
    description: 'this is content for blog post',
    example: 'this is content',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description:
      'Serialize your JSON object else a validation error will be thrown',
  })
  @IsJSON()
  @IsOptional()
  schema?: string;

  @ApiPropertyOptional({
    description: 'Feature image for your blog post',
    example: 'http://localhost.com/img/image1.png',
  })
  @IsUrl()
  @IsOptional()
  @MaxLength(1024)
  featuredImageUrl?: string;
  @ApiPropertyOptional({
    description: 'Timestamp of when the post will be published',
    example: '2024-03-16T07:46:32+0000',
  })
  @IsISO8601()
  @IsOptional()
  @Type(() => String)
  publishOn?: Date;

  @ApiPropertyOptional({
    description: 'Array of tags ids',
    example: [1, 2],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags?: number[];
  @ApiPropertyOptional({
    type: 'object',
    properties: {
      metaValue: {
        type: 'string',
        description: 'the metaValue is a JSON string',
        example: '{"sidebarEnabled:true"}',
      },
    },
  })
  @IsOptional()
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto | undefined;
}
