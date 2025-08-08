import { ColumnsService } from './columns.service';
import { CreateColumnDto, UpdateColumnDto } from './dto/column.dto';
export declare class ColumnsController {
    private readonly columnsService;
    constructor(columnsService: ColumnsService);
    create(createColumnDto: CreateColumnDto, req: any): Promise<{
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
    findByBoard(boardId: string, req: any): Promise<({
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
    update(id: string, updateColumnDto: UpdateColumnDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        id: string;
        title: string;
        position: number;
        boardId: string;
    }>;
}
