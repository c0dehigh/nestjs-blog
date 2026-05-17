import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserProvider } from './create-user.provider';
import { MailService } from '../../mail/providers/mail.service';
import { HashingProvider } from '../../auth/providers/hashing.provider';
import { DataSource, Repository, ObjectLiteral } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});
describe('CreateUserProvider', () => {
  let provider: CreateUserProvider;
  let usersRepository: MockRepository;
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'Hohn@do.com',
    password: '123abc',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserProvider,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: { createMockRepository },
        },
        {
          provide: MailService,
          useValue: { sendUserWelcome: jest.fn(() => Promise.resolve()) },
        },
        {
          provide: HashingProvider,
          useValue: {
            hashPassword: jest.fn(() => user.password),
          },
        },
      ],
    }).compile();

    provider = module.get<CreateUserProvider>(CreateUserProvider);
    usersRepository = module.get<MockRepository>(getRepositoryToken(User));
  });

  it('Service should be defined', () => {
    expect(provider).toBeDefined();
  });
});
