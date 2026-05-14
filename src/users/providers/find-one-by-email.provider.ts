import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindOneByEmailProvider {
  constructor(
    /**
     * Inject usersRepository
     */
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async findOneByEmail(email: string) {
    let user: User | null = null;

    try {
      // null if user is not found
      user = await this.usersRepository.findOneBy({
        email: email,
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not fetch the user',
      });
    }

    return user;
  }
}
