import { CardsService } from './cards.service';
import { CreateCardDto, UpdateCardDto, MoveCardDto } from './dto/card.dto';
export declare class CardsController {
    private cardsService;
    constructor(cardsService: CardsService);
    createCard(req: any, createCardDto: CreateCardDto): Promise<{
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
    updateCard(cardId: string, req: any, updateCardDto: UpdateCardDto): Promise<{
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
    deleteCard(cardId: string, req: any): Promise<void>;
    moveCard(cardId: string, req: any, moveCardDto: MoveCardDto): Promise<{
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
}
