import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
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
    const newUsers: User[] = [];

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
      for (const user of createManyUsersDto.users) {
        const newUser = this.usersRepository.create(user);
        const result = await queryRunner.manager.save(newUser);
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
