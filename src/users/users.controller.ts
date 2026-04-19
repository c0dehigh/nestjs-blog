import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateManyUsersDto } from './dtos/create-users-many.dto';
<<<<<<< HEAD
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
=======
>>>>>>> b1e850c4300fd13821021324039f3d0f0102f38e
@Controller('users')
@ApiTags('Users')
class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // optional '{/:id}'

  @Get('{/:id}')
  @ApiOperation({
    summary: 'fetch all registered users on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'users fetch successfully base on query ',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'the number of entries returned per query',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'the number of entries returned per page',
    example: 3,
  })
  public getUsers(
    @Param() getUsersParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll(getUsersParamDto, limit, page);
  }

  @Post()
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

<<<<<<< HEAD
  @UseGuards(AccessTokenGuard)
=======
>>>>>>> b1e850c4300fd13821021324039f3d0f0102f38e
  @Post('create-many')
  public createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
    return this.usersService.createMany(createManyUsersDto);
  }

  @Patch()
  public patchUsers(@Body() patchUserDto: PatchUserDto) {
    return patchUserDto;
  }
}

export default UsersController;
