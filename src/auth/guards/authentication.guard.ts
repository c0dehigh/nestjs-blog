import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from './access-token/access-token.guard';
import { AuthType } from '../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  >;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // authTypes from reflector
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    // show authTypes

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    // print all the guards

    // default error

    const error = new UnauthorizedException();

    // array of guards
    for (const instance of guards) {
      const canActive = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => {
        error: err;
      });

      if (canActive) {
        return true;
      }
    }

    throw error;
  }
}
