import {
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export interface UserTokenPayload {
  nome: string;
  last_name: string;
  username: string;
  uuid: string;
  id: number;
  password_hash: string;
  status: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: UserTokenPayload;
}

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  use(req: AuthRequest, res: Response, next: NextFunction) {
    const secret = process.env.PRIVATE_KEY_JWT;
    if (!secret) {
      throw new InternalServerErrorException('Missing the secret env variable');
    }
    const authHeader = req.headers['authorization'] as string;
    if (!authHeader || authHeader === null) {
      throw new UnauthorizedException('Missing token');
    }

    const Bearer = authHeader.split(' ');
    const token = Bearer[1] as string;

    try {
      const decoded = jwt.verify(token, secret) as UserTokenPayload;
      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException('Authentication failed');
      }
    }
  }
}
