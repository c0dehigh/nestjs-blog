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
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get('{/:userId}')
  public getPosts(
    @Param('userId') userId: string,
    @Query() postQuery: GetPostsDto,
  ) {
<<<<<<< HEAD
    return this.postsService.findAll(postQuery, userId);
=======
    console.log(postQuery);

    return this.postsService.findAll(userId);
>>>>>>> b1e850c4300fd13821021324039f3d0f0102f38e
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
