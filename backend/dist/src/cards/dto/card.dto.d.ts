export declare class CreateCardDto {
    title: string;
    description?: string;
    columnId: string;
    position: number;
    assignedTo?: string;
    dueDate?: string;
}
export declare class UpdateCardDto {
    title?: string;
    description?: string;
    columnId?: string;
    position?: number;
    assignedTo?: string | null;
    dueDate?: string | null;
}
export declare class MoveCardDto {
    columnId: string;
    position: number;
}
