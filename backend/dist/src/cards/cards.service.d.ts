import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto, UpdateCardDto, MoveCardDto } from './dto/card.dto';
export declare class CardsService {
    private prisma;
    constructor(prisma: PrismaService);
    createCard(userId: string, createCardDto: CreateCardDto): Promise<{
        id: any;
        title: any;
        description: any;
        position: any;
        columnId: any;
        assignedTo: any;
        dueDate: any;
        attachments: any;
        createdAt: any;
        updatedAt: any;
    }>;
    updateCard(cardId: string, userId: string, updateCardDto: UpdateCardDto): Promise<{
        id: any;
        title: any;
        description: any;
        position: any;
        columnId: any;
        assignedTo: any;
        dueDate: any;
        attachments: any;
        createdAt: any;
        updatedAt: any;
    }>;
    deleteCard(cardId: string, userId: string): Promise<void>;
    moveCard(cardId: string, userId: string, moveCardDto: MoveCardDto): Promise<{
        id: any;
        title: any;
        description: any;
        position: any;
        columnId: any;
        assignedTo: any;
        dueDate: any;
        attachments: any;
        createdAt: any;
        updatedAt: any;
    }>;
    private formatCard;
}
