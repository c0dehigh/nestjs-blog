import { Module, forwardRef } from '@nestjs/common';
import UsersController from './users.controller';
import { UsersService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersCreateManyProvider } from './providers/users-create-many.provider';
<<<<<<< HEAD
import { CreateUserProvider } from './providers/create-user.provider';
import { FindOneByEmailProvider } from './providers/find-one-by-email.provider';
=======
>>>>>>> b1e850c4300fd13821021324039f3d0f0102f38e
import profileConfig from './config/profile.config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';

@Module({
  controllers: [UsersController],
<<<<<<< HEAD
  providers: [
    UsersService,
    UsersCreateManyProvider,
    CreateUserProvider,
    FindOneByEmailProvider,
  ],
=======
  providers: [UsersService, UsersCreateManyProvider],
>>>>>>> b1e850c4300fd13821021324039f3d0f0102f38e
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
