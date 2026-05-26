import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { postType } from './enums/postType.enum';
import { postStatus } from './enums/postStatus.enum';

@Schema()
export class Post extends Document {
  @Prop({
    type: String,
    isRequired: true,
  })
  title: string;
  @Prop({
    type: String,
    isRequired: true,
    enum: postType,
    default: postType.POST,
  })
  postType: postType;
  @Prop({
    type: String,
    isRequired: true,
  })
  slug: string;
  @Prop({
    type: String,
    isRequired: true,
    enum: postStatus,
    default: postStatus.DRAFT,
  })
  status: postStatus;
  @Prop({
    type: String,
    isRequired: false,
  })
  content?: string;
  @Prop({
    type: String,
    isRequired: false,
  })
  featuredImageUrl?: string;
  @Prop({
    type: Date,
    isRequired: false,
  })
  publishOn?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
