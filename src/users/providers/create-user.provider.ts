import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { MailService } from 'src/mail/providers/mail.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
     * Injecting userRepository
     */
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    /**
     * Inject Hashing provider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
    /**
     * Inject Mail service
     */

    private readonly mailService: MailService,
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

    let newUser = this.usersRepository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    });

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
    try {
      await this.mailService.sendUserWelcome(newUser);
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
    return newUser;
  }
}
