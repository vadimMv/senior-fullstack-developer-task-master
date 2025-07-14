import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Request } from 'express';
import { User } from '../users/users.entity';

interface RequestWithUser extends Request {
  user?: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const username = request.headers['token'] as string | undefined;

    if (!username) {
      throw new UnauthorizedException('Token header is missing');
    }

    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check if user is deleted - return 401 Unauthorized
    if (user.isDeleted()) {
      throw new UnauthorizedException('Access denied: User account has been deleted');
    }

    // Optional: Also check if user is disabled
    if (user.isDisabled()) {
      throw new UnauthorizedException('Access denied: User account is disabled');
    }

    request.user = user;
    return true;
  }
}