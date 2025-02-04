import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtKey = process.env.JWT_KEY;
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    try {
      const decoded = await this.jwtService.verify(token, {
        secret: this.jwtKey,
      });

      request.user = decoded;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
