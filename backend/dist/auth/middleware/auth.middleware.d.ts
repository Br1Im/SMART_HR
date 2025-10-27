import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthMiddleware implements NestMiddleware {
    private jwtService;
    private configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
