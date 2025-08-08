import { PrismaService } from '../prisma/prisma.service';
import { CreateColumnDto, UpdateColumnDto } from './dto/column.dto';
export declare class ColumnsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createColumnDto: CreateColumnDto, userId: string): Promise<{
        cards: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            position: number;
            columnId: string;
            assignedTo: string | null;
            dueDate: Date | null;
        }[];
    } & {
        id: string;
        title: string;
        position: number;
        boardId: string;
    }>;
    findByBoard(boardId: string, userId: string): Promise<({
        cards: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            position: number;
            columnId: string;
            assignedTo: string | null;
            dueDate: Date | null;
        }[];
    } & {
        id: string;
        title: string;
        position: number;
        boardId: string;
    })[]>;
    update(id: string, updateColumnDto: UpdateColumnDto, userId: string): Promise<{
        cards: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            position: number;
            columnId: string;
            assignedTo: string | null;
            dueDate: Date | null;
        }[];
    } & {
        id: string;
        title: string;
        position: number;
        boardId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        id: string;
        title: string;
        position: number;
        boardId: string;
    }>;
}
