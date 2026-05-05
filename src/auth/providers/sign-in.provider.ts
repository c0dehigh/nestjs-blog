import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    /**
     * Inject user service
     */
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    /**
     * Inject Hashing provider
     */
    private readonly hashingProvider: HashingProvider,

    /**
     * Inject generateTokensProvider
     */

    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    // Find the user using email ID
    // Throw an exception user not found

    const user = await this.userService.findOneByEmail(signInDto.email);
    // Compare password to the hash

    if (!user) {
      throw new UnauthorizedException();
    }

    let isEqual: boolean = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare passwords',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect Password');
    }
    return await this.generateTokensProvider.generateTokens(user);
  }
}
