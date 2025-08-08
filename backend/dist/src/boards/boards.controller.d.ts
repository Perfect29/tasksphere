import { BoardsService } from './boards.service';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';
export declare class BoardsController {
    private boardsService;
    constructor(boardsService: BoardsService);
    createBoard(req: any, createBoardDto: CreateBoardDto): Promise<{
        id: any;
        title: any;
        description: any;
        createdAt: any;
        updatedAt: any;
        members: any;
        columns: any;
    }>;
    getUserBoards(req: any): Promise<{
        id: any;
        title: any;
        description: any;
        createdAt: any;
        updatedAt: any;
        members: any;
        columns: any;
    }[]>;
    getBoardById(boardId: string, req: any): Promise<{
        id: any;
        title: any;
        description: any;
        createdAt: any;
        updatedAt: any;
        members: any;
        columns: any;
    }>;
    updateBoard(boardId: string, req: any, updateBoardDto: UpdateBoardDto): Promise<{
        id: any;
        title: any;
        description: any;
        createdAt: any;
        updatedAt: any;
        members: any;
        columns: any;
    }>;
    deleteBoard(boardId: string, req: any): Promise<void>;
}
