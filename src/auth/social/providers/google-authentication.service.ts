import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import jwtConfig from 'src/auth/config/jwt.config';
import { GoogleTokenDto } from '../dtos/google-token.dto';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from 'src/auth/providers/generate-tokens.provider';

@Injectable()
export class GoogleAuthenticationService implements OnModuleInit {
  private oAuthClinet: OAuth2Client;

  constructor(
    /**
     * Inject user service
     */

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    /**
     * Inject jwtConfiguration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,

    /**
     * Inject generateTokensProvider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  onModuleInit() {
    const clientId = this.jwtConfiguration.googleClientId;
    const clientSecret = this.jwtConfiguration.googleClientSecret;

    this.oAuthClinet = new OAuth2Client(clientId, clientSecret);
  }

  public async authenticate(googleTokenDto: GoogleTokenDto) {
    // verify the token send by user
    const loginTicket = await this.oAuthClinet.verifyIdToken({
      idToken: googleTokenDto.token,
    });
    console.log(loginTicket);

    // extract payload from google jwt
    const payload = loginTicket.getPayload();
    if (!payload) {
      throw new BadRequestException('Invalid token');
    }
    const {
      email,
      sub: googleId,
      given_name: firstName,
      family_name: lastName,
    } = payload;
    // find the user in database from googleId

    let user = await this.usersService.findOneByGoogleId(googleId);
    // if googleId exist in database generate token
    if (user) {
      return await this.generateTokensProvider.generateTokens(user);
    }
    // if not create user then generate token

    // throw unauthorized exception
  }
}
