import {
  BadRequestException,
  Body,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from '../../tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post-dto';
import { Tag } from 'src/tags/tag.entity';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { CreatePostProvider } from './create-post.provider';
import { ActiveUserData } from 'src/auth/interfaces/active-user.interface';

@Injectable()
export class PostsService {
  constructor(
    /**
     * Injecting User Service
     */
    private readonly usersService: UsersService,

    /**
     * inject post repository
     */
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    /**
     * inject metaOptions repository
     */

    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
    /**
     * Inject tags service
     */

    private readonly tagsService: TagsService,

    /**
     * Injecting pagination provider
     */

    private readonly paginationProvider: PaginationProvider,

    /**
     * Inject createPostProvider
     */

    private readonly createPostProvider: CreatePostProvider,
  ) {}

  /**
   * Creating new posts
   */

  public async create(createPostDto: CreatePostDto, user: ActiveUserData) {
    return await this.createPostProvider.create(createPostDto, user);
  }

  public async update(patchPostDto: PatchPostDto) {
    let tags: null | Tag[] = null;
    let post: null | Post = null;

    if (!patchPostDto.tags) {
      return;
    }

    // Find the tags

    try {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
    } catch (error) {
      throw new RequestTimeoutException(
        'Failed to find the tags. Please try again later.',
      );
    }

    /**
     * Number of tags need to be equal
     */

    if (!tags || tags.length !== patchPostDto.tags.length) {
      throw new BadRequestException(
        'Some of the tags provided are invalid. Please check the tag IDs and try again.',
      );
    }

    // Find the post

    try {
      post = await this.postRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Failed to find the post. Please try again later.',
      );
    }

    // Update the properties

    if (!post) {
      throw new BadRequestException(
        'Post not found. Please check the post ID and try again.',
      );
    }
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;

    // assign the new tags
    post.tags = tags;
    // save the post and return the updated post
    try {
      await this.postRepository.save(post);
    } catch (error) {
      throw new BadRequestException(
        'Failed to update the post. Please try again later.',
      );
    }

    return post;
  }

  public async findAll(
    postQuery: GetPostsDto,
    userId: string,
  ): Promise<Paginated<Post>> {
    const posts = await this.paginationProvider.paginatedQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postRepository,
    );
    return posts;
  }

  public async delete(id: number) {
    await this.postRepository.delete(id);
    return { deleted: true, id };
  }
}
