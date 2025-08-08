import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        user: any;
        token: string;
    }>;
    register(registerDto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    getCurrentUser(req: any): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
