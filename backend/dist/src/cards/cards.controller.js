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
exports.CardsController = void 0;
const common_1 = require("@nestjs/common");
const cards_service_1 = require("./cards.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const card_dto_1 = require("./dto/card.dto");
let CardsController = class CardsController {
    constructor(cardsService) {
        this.cardsService = cardsService;
    }
    async createCard(req, createCardDto) {
        return this.cardsService.createCard(req.user.userId, createCardDto);
    }
    async updateCard(cardId, req, updateCardDto) {
        return this.cardsService.updateCard(cardId, req.user.userId, updateCardDto);
    }
    async deleteCard(cardId, req) {
        return this.cardsService.deleteCard(cardId, req.user.userId);
    }
    async moveCard(cardId, req, moveCardDto) {
        return this.cardsService.moveCard(cardId, req.user.userId, moveCardDto);
    }
};
exports.CardsController = CardsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, card_dto_1.CreateCardDto]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "createCard", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, card_dto_1.UpdateCardDto]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "updateCard", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "deleteCard", null);
__decorate([
    (0, common_1.Patch)(':id/move'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, card_dto_1.MoveCardDto]),
    __metadata("design:returntype", Promise)
], CardsController.prototype, "moveCard", null);
exports.CardsController = CardsController = __decorate([
    (0, common_1.Controller)('cards'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [cards_service_1.CardsService])
], CardsController);
//# sourceMappingURL=cards.controller.js.map