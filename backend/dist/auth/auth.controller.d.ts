import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): Promise<{
        email: string;
        fullName: string;
        role: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    verifyToken(req: any): Promise<{
        valid: boolean;
        user: {
            userId: any;
            role: any;
        };
    }>;
}
