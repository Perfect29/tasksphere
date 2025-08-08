"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let WebsocketGateway = class WebsocketGateway {
    constructor() {
        this.connectedUsers = new Map();
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        this.connectedUsers.delete(client.id);
    }
    handleJoinBoard(data, client) {
        client.join(`board-${data.boardId}`);
        this.connectedUsers.set(client.id, data.userId);
        client.to(`board-${data.boardId}`).emit('user-joined', {
            userId: data.userId,
            socketId: client.id,
        });
    }
    handleLeaveBoard(data, client) {
        client.leave(`board-${data.boardId}`);
        client.to(`board-${data.boardId}`).emit('user-left', {
            userId: this.connectedUsers.get(client.id),
            socketId: client.id,
        });
    }
    emitBoardUpdate(boardId, event, data) {
        this.server.to(`board-${boardId}`).emit(event, data);
    }
    handleCardMoved(data, client) {
        client.to(`board-${data.boardId}`).emit('card-moved', data);
    }
    handleCardUpdated(data, client) {
        client.to(`board-${data.boardId}`).emit('card-updated', data);
    }
    handleCardCreated(data, client) {
        client.to(`board-${data.boardId}`).emit('card-created', data);
    }
    handleCardDeleted(data, client) {
        client.to(`board-${data.boardId}`).emit('card-deleted', data);
    }
    handleColumnCreated(data, client) {
        client.to(`board-${data.boardId}`).emit('column-created', data);
    }
    handleColumnUpdated(data, client) {
        client.to(`board-${data.boardId}`).emit('column-updated', data);
    }
    handleColumnDeleted(data, client) {
        client.to(`board-${data.boardId}`).emit('column-deleted', data);
    }
};
exports.WebsocketGateway = WebsocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebsocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-board'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleJoinBoard", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-board'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleLeaveBoard", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('card-moved'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleCardMoved", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('card-updated'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleCardUpdated", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('card-created'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleCardCreated", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('card-deleted'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleCardDeleted", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('column-created'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleColumnCreated", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('column-updated'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleColumnUpdated", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('column-deleted'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleColumnDeleted", null);
exports.WebsocketGateway = WebsocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            credentials: true,
        },
    })
], WebsocketGateway);
//# sourceMappingURL=websocket.gateway.js.map