import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
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
    try {
      // verify the token send by user
      const loginTicket = await this.oAuthClinet.verifyIdToken({
        idToken: googleTokenDto.token,
        audience: this.jwtConfiguration.googleClientId,
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
      if (!email || !googleId || !firstName || !lastName) {
        throw new BadRequestException('Google account payload is incomplete');
      }
      // find the user in database from googleId

      let user = await this.usersService.findOneByGoogleId(googleId);

      if (!user) {
        user = await this.usersService.findOneByEmail(email);

        if (user) {
          // link google account

          user.googleId = googleId;
          await this.usersService.updateUser(user.id, user);
        } else {
          user = await this.usersService.createGoogleUser({
            email,
            firstName,
            lastName,
            googleId,
          });
        }
      }

      return await this.generateTokensProvider.generateTokens(user);
    } catch (error) {
      // throw unauthorized exception
      console.log(error);

      throw new UnauthorizedException(error);
    }
  }
}
