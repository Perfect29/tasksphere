import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
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
    getCurrentUser(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
