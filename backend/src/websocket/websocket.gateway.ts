import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, string>(); // socketId -> userId

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('join-board')
  handleJoinBoard(
    @MessageBody() data: { boardId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`board-${data.boardId}`);
    this.connectedUsers.set(client.id, data.userId);
    
    // Notify other users in the board
    client.to(`board-${data.boardId}`).emit('user-joined', {
      userId: data.userId,
      socketId: client.id,
    });
  }

  @SubscribeMessage('leave-board')
  handleLeaveBoard(
    @MessageBody() data: { boardId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`board-${data.boardId}`);
    
    // Notify other users in the board
    client.to(`board-${data.boardId}`).emit('user-left', {
      userId: this.connectedUsers.get(client.id),
      socketId: client.id,
    });
  }

  // Board events
  emitBoardUpdate(boardId: string, event: string, data: any) {
    this.server.to(`board-${boardId}`).emit(event, data);
  }

  // Card events
  @SubscribeMessage('card-moved')
  handleCardMoved(
    @MessageBody() data: { boardId: string; cardId: string; fromColumnId: string; toColumnId: string; position: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`board-${data.boardId}`).emit('card-moved', data);
  }

  @SubscribeMessage('card-updated')
  handleCardUpdated(
    @MessageBody() data: { boardId: string; card: any },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`board-${data.boardId}`).emit('card-updated', data);
  }

  @SubscribeMessage('card-created')
  handleCardCreated(
    @MessageBody() data: { boardId: string; card: any },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`board-${data.boardId}`).emit('card-created', data);
  }

  @SubscribeMessage('card-deleted')
  handleCardDeleted(
    @MessageBody() data: { boardId: string; cardId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`board-${data.boardId}`).emit('card-deleted', data);
  }

  // Column events
  @SubscribeMessage('column-created')
  handleColumnCreated(
    @MessageBody() data: { boardId: string; column: any },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`board-${data.boardId}`).emit('column-created', data);
  }

  @SubscribeMessage('column-updated')
  handleColumnUpdated(
    @MessageBody() data: { boardId: string; column: any },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`board-${data.boardId}`).emit('column-updated', data);
  }

  @SubscribeMessage('column-deleted')
  handleColumnDeleted(
    @MessageBody() data: { boardId: string; columnId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`board-${data.boardId}`).emit('column-deleted', data);
  }
}