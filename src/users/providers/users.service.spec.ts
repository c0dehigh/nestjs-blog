import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { FindOneByEmailProvider } from './find-one-by-email.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-googleid.provider';
import { CreateUserProvider } from './create-user.provider';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  beforeEach(async () => {
    const mockCreateUserProvider: Partial<CreateUserProvider> = {
      createUser: (createUserDto: CreateUserDto) => {
        return Promise.resolve({
          id: 12,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          password: createUserDto.password,
        });
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: CreateUserProvider,
          useValue: mockCreateUserProvider,
        },
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
        {
          provide: CreateGoogleUserProvider,
          useValue: {},
        },
        {
          provide: FindOneByEmailProvider,
          useValue: {},
        },
        {
          provide: FindOneByGoogleIdProvider,
          useValue: {},
        },

        {
          provide: UsersCreateManyProvider,
          useValue: {},
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('Service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should be defined', () => {
      expect(service.createUser).toBeDefined();
    });
    it('should call createUser on CreateUserProvider', async () => {
      let user = await service.createUser({
        firstName: 'hamed',
        lastName: 'zibandeh',
        email: 'hamedzibandeh70@gmail.com',
        password: '123456',
      });
      expect(user.firstName).toEqual('hamed');
    });
  });
});
