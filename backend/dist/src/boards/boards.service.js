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
exports.BoardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BoardsService = class BoardsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBoard(userId, createBoardDto) {
        const board = await this.prisma.board.create({
            data: {
                title: createBoardDto.title,
                description: createBoardDto.description,
                ownerId: userId,
                members: {
                    create: {
                        userId,
                        role: 'owner',
                    },
                },
                columns: {
                    create: [
                        { title: 'To Do', position: 0 },
                        { title: 'In Progress', position: 1 },
                        { title: 'Done', position: 2 },
                    ],
                },
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            },
                        },
                    },
                },
                columns: {
                    include: {
                        cards: {
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
                            orderBy: { position: 'asc' },
                        },
                    },
                    orderBy: { position: 'asc' },
                },
            },
        });
        return this.formatBoard(board);
    }
    async getUserBoards(userId) {
        const boards = await this.prisma.board.findMany({
            where: {
                members: {
                    some: {
                        userId,
                    },
                },
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            },
                        },
                    },
                },
                columns: {
                    include: {
                        cards: {
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
                            orderBy: { position: 'asc' },
                        },
                    },
                    orderBy: { position: 'asc' },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
        return boards.map(board => this.formatBoard(board));
    }
    async getBoardById(boardId, userId) {
        const board = await this.prisma.board.findFirst({
            where: {
                id: boardId,
                members: {
                    some: {
                        userId,
                    },
                },
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            },
                        },
                    },
                },
                columns: {
                    include: {
                        cards: {
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
                            orderBy: { position: 'asc' },
                        },
                    },
                    orderBy: { position: 'asc' },
                },
            },
        });
        if (!board) {
            throw new common_1.NotFoundException('Board not found');
        }
        return this.formatBoard(board);
    }
    async updateBoard(boardId, userId, updateBoardDto) {
        const boardMember = await this.prisma.boardMember.findFirst({
            where: {
                boardId,
                userId,
                role: { in: ['owner', 'admin'] },
            },
        });
        if (!boardMember) {
            throw new common_1.ForbiddenException('You do not have permission to update this board');
        }
        const board = await this.prisma.board.update({
            where: { id: boardId },
            data: updateBoardDto,
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            },
                        },
                    },
                },
                columns: {
                    include: {
                        cards: {
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
                            orderBy: { position: 'asc' },
                        },
                    },
                    orderBy: { position: 'asc' },
                },
            },
        });
        return this.formatBoard(board);
    }
    async deleteBoard(boardId, userId) {
        const board = await this.prisma.board.findFirst({
            where: {
                id: boardId,
                ownerId: userId,
            },
        });
        if (!board) {
            throw new common_1.ForbiddenException('You do not have permission to delete this board');
        }
        await this.prisma.board.delete({
            where: { id: boardId },
        });
    }
    formatBoard(board) {
        return {
            id: board.id,
            title: board.title,
            description: board.description,
            createdAt: board.createdAt.toISOString(),
            updatedAt: board.updatedAt.toISOString(),
            members: board.members.map(member => member.user.id),
            columns: board.columns.map(column => ({
                id: column.id,
                title: column.title,
                position: column.position,
                boardId: column.boardId,
                cards: column.cards.map(card => ({
                    id: card.id,
                    title: card.title,
                    description: card.description,
                    position: card.position,
                    columnId: card.columnId,
                    assignedTo: card.assignedTo,
                    dueDate: card.dueDate?.toISOString(),
                    attachments: card.attachments.map(att => att.url),
                    createdAt: card.createdAt.toISOString(),
                    updatedAt: card.updatedAt.toISOString(),
                })),
            })),
        };
    }
};
exports.BoardsService = BoardsService;
exports.BoardsService = BoardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BoardsService);
//# sourceMappingURL=boards.service.js.map