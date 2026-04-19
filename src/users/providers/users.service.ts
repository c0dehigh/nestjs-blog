import {
  Injectable,
  Inject,
  forwardRef,
  RequestTimeoutException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import type { ConfigType } from '@nestjs/config';

import profileConfig from '../config/profile.config';
<<<<<<< HEAD
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-users-many.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindOneByEmailProvider } from './find-one-by-email.provider';
=======
import { error } from 'console';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-users-many.dto';
>>>>>>> b1e850c4300fd13821021324039f3d0f0102f38e

/**
 * Class that handles the business logic for the users
 */
@Injectable()
export class UsersService {
  constructor(
    /**
     * Injecting userRepository
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,

    /**
     * Inject Data source
     */

    private readonly dataSource: DataSource,

    /**
     * Inject usersCreateManyProvider
     */

    private readonly usersCreateManyProvider: UsersCreateManyProvider,
<<<<<<< HEAD

    /**
     * Inject Create user provider
     */

    private readonly createUserProvider: CreateUserProvider,

    /**
     * Inject findOneUserByEmailProvider
     */

    private readonly findOneUserByEmailProvider: FindOneByEmailProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto);
=======
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser: null | User = null;

    try {
      // Check is user already exists

      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process the request at the moment. Please try again later.',
        {
          description: 'Database connection error',
        },
      );
    }

    // Handle exception

    if (existingUser) {
      throw new BadRequestException('A user with this email already exists.', {
        description: 'Duplicate email error',
      });
    }

    // create a new user

    let newUser = this.usersRepository.create(createUserDto);

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process the request at the moment. Please try again later.',
        {
          description: 'Database connection error',
        },
      );
    }

    return newUser;
>>>>>>> b1e850c4300fd13821021324039f3d0f0102f38e
  }

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto);
  }

  /**
   * the method to find all users
   */
  // public findAll(
  //   getUserParamDto: GetUsersParamDto,
  //   limit: number,
  //   page: number,
  // ) {
  //   console.log(this.profileConfiguration);

  //   return [
  //     {
  //       firstName: 'John',
  //       email: 'john@doe.com',
  //     },
  //     {
  //       firstName: 'Alice',
  //       email: 'alice@doe.com',
  //     },
  //   ];
  // }

  public findAll(
    getUserParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error:
          'This endpoint has been moved permanently. Please use the new endpoint /api/v2/users to access the user data.',
        fileName: 'users.service.ts',
        lineNumber: 123,
      },

      HttpStatus.MOVED_PERMANENTLY,

      {
        description: 'Endpoint moved permanently',
        cause: new Error(),
      },
    );
  }

  /**
   * the method to find a user by id
   */
  public async findOneById(id: number) {
    let user: null | User = null;

    try {
      user = await this.usersRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process the request at the moment. Please try again later.',
        {
          description: 'Database connection error',
        },
      );
    }

    /**
     * handle user does not exist
     */

    if (!user) {
      throw new BadRequestException(`User with id ${id} not found.`, {
        description: 'User not found error',
      });
    }

    return user;
<<<<<<< HEAD
  }

  public async findOneByEmail(email: string) {
    return await this.findOneUserByEmailProvider.findOneByEmail(email);
=======
>>>>>>> b1e850c4300fd13821021324039f3d0f0102f38e
  }
}
