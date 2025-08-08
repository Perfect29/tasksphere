import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private connectedUsers;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinBoard(data: {
        boardId: string;
        userId: string;
    }, client: Socket): void;
    handleLeaveBoard(data: {
        boardId: string;
    }, client: Socket): void;
    emitBoardUpdate(boardId: string, event: string, data: any): void;
    handleCardMoved(data: {
        boardId: string;
        cardId: string;
        fromColumnId: string;
        toColumnId: string;
        position: number;
    }, client: Socket): void;
    handleCardUpdated(data: {
        boardId: string;
        card: any;
    }, client: Socket): void;
    handleCardCreated(data: {
        boardId: string;
        card: any;
    }, client: Socket): void;
    handleCardDeleted(data: {
        boardId: string;
        cardId: string;
    }, client: Socket): void;
    handleColumnCreated(data: {
        boardId: string;
        column: any;
    }, client: Socket): void;
    handleColumnUpdated(data: {
        boardId: string;
        column: any;
    }, client: Socket): void;
    handleColumnDeleted(data: {
        boardId: string;
        columnId: string;
    }, client: Socket): void;
}
