import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokensProvider } from './refresh-tokens.provider';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Injecting user service
     */

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /**
     * Inject signInProvider
     */

    private readonly signInProvider: SignInProvider,

    /**
     * Inject refreshTokensProvider
     */
    private readonly refreshTokensProvider: RefreshTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return this.refreshTokensProvider.refreshTokens(refreshTokenDto);
  }
}
