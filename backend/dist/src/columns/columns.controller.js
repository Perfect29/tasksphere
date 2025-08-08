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
exports.ColumnsController = void 0;
const common_1 = require("@nestjs/common");
const columns_service_1 = require("./columns.service");
const column_dto_1 = require("./dto/column.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ColumnsController = class ColumnsController {
    constructor(columnsService) {
        this.columnsService = columnsService;
    }
    create(createColumnDto, req) {
        return this.columnsService.create(createColumnDto, req.user.userId);
    }
    findByBoard(boardId, req) {
        return this.columnsService.findByBoard(boardId, req.user.userId);
    }
    update(id, updateColumnDto, req) {
        return this.columnsService.update(id, updateColumnDto, req.user.userId);
    }
    remove(id, req) {
        return this.columnsService.remove(id, req.user.userId);
    }
};
exports.ColumnsController = ColumnsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [column_dto_1.CreateColumnDto, Object]),
    __metadata("design:returntype", void 0)
], ColumnsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('board/:boardId'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ColumnsController.prototype, "findByBoard", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, column_dto_1.UpdateColumnDto, Object]),
    __metadata("design:returntype", void 0)
], ColumnsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ColumnsController.prototype, "remove", null);
exports.ColumnsController = ColumnsController = __decorate([
    (0, common_1.Controller)('columns'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [columns_service_1.ColumnsService])
], ColumnsController);
//# sourceMappingURL=columns.controller.js.map