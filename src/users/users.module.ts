import { Module, forwardRef } from '@nestjs/common';
import UsersController from './users.controller';
import { UsersService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersCreateManyProvider } from './providers/users-create-many.provider';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneByEmailProvider } from './providers/find-one-by-email.provider';
import profileConfig from './config/profile.config';
import { JwtModule } from '@nestjs/jwt';
import { FindOneByGoogleIdProvider } from './providers/find-one-by-googleid.provider';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';
import jwtConfig from 'src/auth/config/jwt.config';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersCreateManyProvider,
    CreateUserProvider,
    FindOneByEmailProvider,
    FindOneByGoogleIdProvider,
    CreateGoogleUserProvider,
  ],
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(profileConfig),
    forwardRef(() => AuthModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
})
export class UsersModule {}
