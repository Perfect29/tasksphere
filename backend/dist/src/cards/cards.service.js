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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CardsService = class CardsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCard(userId, createCardDto) {
        const column = await this.prisma.column.findFirst({
            where: {
                id: createCardDto.columnId,
                board: {
                    members: {
                        some: {
                            userId,
                        },
                    },
                },
            },
        });
        if (!column) {
            throw new common_1.ForbiddenException('You do not have access to this board');
        }
        const lastCard = await this.prisma.card.findFirst({
            where: { columnId: createCardDto.columnId },
            orderBy: { position: 'desc' },
        });
        const position = lastCard ? lastCard.position + 1 : 0;
        const card = await this.prisma.card.create({
            data: {
                title: createCardDto.title,
                description: createCardDto.description,
                columnId: createCardDto.columnId,
                position,
                assignedTo: createCardDto.assignedTo ?? null,
                dueDate: createCardDto.dueDate ? new Date(createCardDto.dueDate) : null,
            },
            include: {
                assignee: { select: { id: true, name: true, email: true, avatar: true } },
                attachments: true,
            },
        });
        return this.formatCard(card);
    }
    async updateCard(cardId, userId, updateCardDto) {
        const card = await this.prisma.card.findFirst({
            where: {
                id: cardId,
                column: {
                    board: {
                        members: {
                            some: {
                                userId,
                            },
                        },
                    },
                },
            },
        });
        if (!card) {
            throw new common_1.NotFoundException('Card not found or access denied');
        }
        const data = {};
        if (updateCardDto.title !== undefined)
            data.title = updateCardDto.title;
        if (updateCardDto.description !== undefined)
            data.description = updateCardDto.description;
        if (updateCardDto.columnId !== undefined)
            data.columnId = updateCardDto.columnId;
        if (updateCardDto.position !== undefined)
            data.position = updateCardDto.position;
        if (updateCardDto.assignedTo !== undefined)
            data.assignedTo = updateCardDto.assignedTo ?? null;
        if (updateCardDto.dueDate !== undefined) {
            data.dueDate = updateCardDto.dueDate ? new Date(updateCardDto.dueDate) : null;
        }
        const updatedCard = await this.prisma.card.update({
            where: { id: cardId },
            data,
            include: {
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                attachments: true,
            },
        });
        return this.formatCard(updatedCard);
    }
    async deleteCard(cardId, userId) {
        const card = await this.prisma.card.findFirst({
            where: {
                id: cardId,
                column: {
                    board: {
                        members: {
                            some: {
                                userId,
                            },
                        },
                    },
                },
            },
        });
        if (!card) {
            throw new common_1.NotFoundException('Card not found or access denied');
        }
        await this.prisma.card.delete({
            where: { id: cardId },
        });
    }
    async moveCard(cardId, userId, moveCardDto) {
        const card = await this.prisma.card.findFirst({
            where: {
                id: cardId,
                column: {
                    board: {
                        members: {
                            some: {
                                userId,
                            },
                        },
                    },
                },
            },
        });
        if (!card) {
            throw new common_1.NotFoundException('Card not found or access denied');
        }
        const targetColumn = await this.prisma.column.findFirst({
            where: {
                id: moveCardDto.columnId,
                board: {
                    members: {
                        some: {
                            userId,
                        },
                    },
                },
            },
        });
        if (!targetColumn) {
            throw new common_1.ForbiddenException('You do not have access to the target column');
        }
        await this.prisma.$transaction(async (prisma) => {
            if (card.columnId !== moveCardDto.columnId) {
                await prisma.card.updateMany({
                    where: {
                        columnId: card.columnId,
                        position: { gt: card.position },
                    },
                    data: {
                        position: { decrement: 1 },
                    },
                });
                await prisma.card.updateMany({
                    where: {
                        columnId: moveCardDto.columnId,
                        position: { gte: moveCardDto.position },
                    },
                    data: {
                        position: { increment: 1 },
                    },
                });
            }
            else {
                if (moveCardDto.position > card.position) {
                    await prisma.card.updateMany({
                        where: {
                            columnId: card.columnId,
                            position: { gt: card.position, lte: moveCardDto.position },
                        },
                        data: {
                            position: { decrement: 1 },
                        },
                    });
                }
                else if (moveCardDto.position < card.position) {
                    await prisma.card.updateMany({
                        where: {
                            columnId: card.columnId,
                            position: { gte: moveCardDto.position, lt: card.position },
                        },
                        data: {
                            position: { increment: 1 },
                        },
                    });
                }
            }
            await prisma.card.update({
                where: { id: cardId },
                data: {
                    columnId: moveCardDto.columnId,
                    position: moveCardDto.position,
                },
            });
        });
        const updatedCard = await this.prisma.card.findUnique({
            where: { id: cardId },
            include: {
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                attachments: true,
            },
        });
        return this.formatCard(updatedCard);
    }
    formatCard(card) {
        return {
            id: card.id,
            title: card.title,
            description: card.description,
            position: card.position,
            columnId: card.columnId,
            assignedTo: card.assignedTo,
            dueDate: card.dueDate?.toISOString(),
            attachments: card.attachments?.map(att => att.url) || [],
            createdAt: card.createdAt.toISOString(),
            updatedAt: card.updatedAt.toISOString(),
        };
    }
};
exports.CardsService = CardsService;
exports.CardsService = CardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CardsService);
//# sourceMappingURL=cards.service.js.map