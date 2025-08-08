import { io, Socket } from 'socket.io-client';
import { store } from '../store';
import { updateBoardRealtime } from '../store/slices/boardsSlice';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect() {
    if (this.socket?.connected) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const serverUrl = process.env.NODE_ENV === 'production' 
      ? 'https://api.tasksphere.com' 
      : 'http://localhost:3001';

    this.socket = io(serverUrl, {
      auth: {
        token,
      },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('board-updated', (board) => {
      store.dispatch(updateBoardRealtime(board));
    });

    this.socket.on('card-moved', (data) => {
      // Handle real-time card movement
      console.log('Card moved:', data);
    });

    this.socket.on('card-created', (data) => {
      // Handle real-time card creation
      console.log('Card created:', data);
    });

    this.socket.on('card-updated', (data) => {
      // Handle real-time card updates
      console.log('Card updated:', data);
    });

    this.socket.on('card-deleted', (data) => {
      // Handle real-time card deletion
      console.log('Card deleted:', data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinBoard(boardId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-board', boardId);
    }
  }

  leaveBoard(boardId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-board', boardId);
    }
  }

  emitCardMove(cardId: string, columnId: string, position: number) {
    if (this.socket && this.isConnected) {
      this.socket.emit('move-card', { cardId, columnId, position });
    }
  }

  emitCardCreate(cardData: any) {
    if (this.socket && this.isConnected) {
      this.socket.emit('create-card', cardData);
    }
  }

  emitCardUpdate(cardId: string, data: any) {
    if (this.socket && this.isConnected) {
      this.socket.emit('update-card', { cardId, data });
    }
  }

  emitCardDelete(cardId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('delete-card', cardId);
    }
  }
}

export const socketService = new SocketService();