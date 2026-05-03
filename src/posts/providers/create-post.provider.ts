import {
  BadRequestException,
  Body,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Tag } from 'src/tags/tag.entity';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { UsersService } from 'src/users/providers/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';

@Injectable()
export class CreatePostProvider {
  constructor(
    /**
     * Injecting User Service
     */
    private readonly usersService: UsersService,
    /**
     * Inject tags service
     */

    private readonly tagsService: TagsService,

    /**
     * inject post repository
     */
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    try {
      // find author from a database on authorId
      const author = await this.usersService.findOneById(user.sub);

      if (!author) {
        throw new NotFoundException('Author not found');
      }

      let tags: Tag[] = [];

      if (createPostDto.tags && createPostDto.tags.length > 0) {
        tags = await this.tagsService.findMultipleTags(createPostDto.tags);

        const post = this.postRepository.create({
          ...createPostDto,
          author: author,
          tags: tags,
        });

        return await this.postRepository.save(post);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while creating the post',
      );
    }
  }

  // public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
  //   let author = undefined;
  //   let tags = undefined;

  //   try {
  //     author = (await this.usersService.findOneById(user.sub)) as any;
  //     tags = await this.tagsService.findMultipleTags(createPostDto.tags);
  //   } catch (error) {
  //     throw new ConflictException(error);
  //   }

  //   if (createPostDto.tags?.length !== tags.length) {
  //     throw new BadRequestException('Please check your tag ids');
  //   }

  //   let post = this.postRepository.create({
  //     ...createPostDto,
  //     author: author,
  //     tags: tags,
  //   });

  //   return await this.postRepository.save(post);
  // }
}
