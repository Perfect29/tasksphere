import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';
export declare class BoardsService {
    private prisma;
    constructor(prisma: PrismaService);
    createBoard(userId: string, createBoardDto: CreateBoardDto): Promise<{
        id: any;
        title: any;
        description: any;
        createdAt: any;
        updatedAt: any;
        members: any;
        columns: any;
    }>;
    getUserBoards(userId: string): Promise<{
        id: any;
        title: any;
        description: any;
        createdAt: any;
        updatedAt: any;
        members: any;
        columns: any;
    }[]>;
    getBoardById(boardId: string, userId: string): Promise<{
        id: any;
        title: any;
        description: any;
        createdAt: any;
        updatedAt: any;
        members: any;
        columns: any;
    }>;
    updateBoard(boardId: string, userId: string, updateBoardDto: UpdateBoardDto): Promise<{
        id: any;
        title: any;
        description: any;
        createdAt: any;
        updatedAt: any;
        members: any;
        columns: any;
    }>;
    deleteBoard(boardId: string, userId: string): Promise<void>;
    private formatBoard;
}
