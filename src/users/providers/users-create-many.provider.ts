import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateManyUsersDto } from '../dtos/create-users-many.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    /**
     * Injecting userRepository
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    /**
     * Inject Data source
     */

    private readonly dataSource: DataSource,
  ) {}

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
<<<<<<< HEAD
    const newUsers: User[] = [];
=======
    let newUsers: User[] = [];
>>>>>>> b1e850c4300fd13821021324039f3d0f0102f38e

    // Create Query Runner Instance
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      // Connect Query Runner to datasource
      await queryRunner.connect();
      // Start Transaction
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException({
        message: 'Error connecting to database',
      });
    }

    try {
<<<<<<< HEAD
      for (const user of createManyUsersDto.users) {
        const newUser = this.usersRepository.create(user);
        const result = await queryRunner.manager.save(newUser);
=======
      for (let user of createManyUsersDto.users) {
        let newUser = this.usersRepository.create(user);
        let result = await queryRunner.manager.save(newUser);
>>>>>>> b1e850c4300fd13821021324039f3d0f0102f38e
        newUsers.push(result);
      }

      // If successful comit the transaction

      await queryRunner.commitTransaction();
    } catch (error) {
      // If error rollback the transaction
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete the transactions', {
        description: String(error),
      });
    } finally {
      // Release connection
      try {
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException({
          message: 'Error releasing database connection',
          description: String(error),
        });
      }
    }

    return newUsers;
  }
}
