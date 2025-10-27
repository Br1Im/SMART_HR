import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            email: string;
            fullName: string;
            role: string;
            id: string;
            createdAt: Date;
        };
        token: string;
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            role: string;
            createdAt: Date;
        };
        token: string;
        message: string;
    }>;
    validateUser(email: string, password: string): Promise<{
        email: string;
        fullName: string;
        role: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserById(id: string): Promise<{
        email: string;
        fullName: string;
        role: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
