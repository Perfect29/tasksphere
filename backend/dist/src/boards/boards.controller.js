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
exports.BoardsController = void 0;
const common_1 = require("@nestjs/common");
const boards_service_1 = require("./boards.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const board_dto_1 = require("./dto/board.dto");
let BoardsController = class BoardsController {
    constructor(boardsService) {
        this.boardsService = boardsService;
    }
    async createBoard(req, createBoardDto) {
        return this.boardsService.createBoard(req.user.userId, createBoardDto);
    }
    async getUserBoards(req) {
        return this.boardsService.getUserBoards(req.user.userId);
    }
    async getBoardById(boardId, req) {
        return this.boardsService.getBoardById(boardId, req.user.userId);
    }
    async updateBoard(boardId, req, updateBoardDto) {
        return this.boardsService.updateBoard(boardId, req.user.userId, updateBoardDto);
    }
    async deleteBoard(boardId, req) {
        return this.boardsService.deleteBoard(boardId, req.user.userId);
    }
};
exports.BoardsController = BoardsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, board_dto_1.CreateBoardDto]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "createBoard", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "getUserBoards", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "getBoardById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, board_dto_1.UpdateBoardDto]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "updateBoard", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "deleteBoard", null);
exports.BoardsController = BoardsController = __decorate([
    (0, common_1.Controller)('boards'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [boards_service_1.BoardsService])
], BoardsController);
//# sourceMappingURL=boards.controller.js.map