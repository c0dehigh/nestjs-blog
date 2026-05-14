import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Query,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dtos/create-post.dto';
import { PatchPostDto } from './dtos/patch-post-dto';
import { GetPostsDto } from './dtos/get-posts.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import type { ActiveUserData } from 'src/auth/interfaces/active-user.interface';

@Controller('posts')
@ApiTags('posts')
export class PostsController {
  constructor(
    /**
     * Injecting Posts Service
     */

    private readonly postsService: PostsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new post',
  })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
  })
  public createPost(
    @Body() createPostDto: CreatePostDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.postsService.create(createPostDto, user);
  }

  @Get('{/:userId}')
  public getPosts(
    @Param('userId') userId: string,
    @Query() postQuery: GetPostsDto,
  ) {
    return this.postsService.findAll(postQuery, userId);
  }
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
  })
  @Patch()
  updatePost(@Body() patchPostDto: PatchPostDto) {
    return this.postsService.update(patchPostDto);
  }

  @Delete()
  public deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
