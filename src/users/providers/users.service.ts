import {
  Injectable,
  Inject,
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
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-users-many.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindOneByEmailProvider } from './find-one-by-email.provider';
import { FindOneByGoogleidProvider } from './find-one-by-googleid.provider';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { GoogleUser } from '../interfaces/google-user.interface';
import { PatchUserDto } from '../dtos/patch-user.dto';

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

    /**
     * Inject Create user provider
     */

    private readonly createUserProvider: CreateUserProvider,

    /**
     * Inject findOneUserByEmailProvider
     */

    private readonly findOneUserByEmailProvider: FindOneByEmailProvider,

    /**
     * inject findOneByGoogleIdProvider
     */
    private readonly findOneByGoogleIdProvider: FindOneByGoogleidProvider,

    /**
     * Inject createGoogleUserProvider
     */
    private readonly createGoogleUserProvider: CreateGoogleUserProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createMany(createManyUsersDto);
  }

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
          cause: String(error),
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
  }

  /**
   * the method to update a user by id
   */
  public async updateUser(id: number, patchUserDto: PatchUserDto) {
    const user = await this.findOneById(id);

    const updatedUser = this.usersRepository.merge(user, patchUserDto);

    try {
      return await this.usersRepository.save(updatedUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process the request at the moment. Please try again later.',
        {
          description: 'Database connection error',
          cause: String(error),
        },
      );
    }
  }

  public async findOneByEmail(email: string) {
    return await this.findOneUserByEmailProvider.findOneByEmail(email);
  }

  public async findOneByGoogleId(googleId: string) {
    return await this.findOneByGoogleIdProvider.findOneByGoogleId(googleId);
  }

  public async createGoogleUser(googleUser: GoogleUser) {
    return await this.createGoogleUserProvider.createGoogleUser(googleUser);
  }
}
