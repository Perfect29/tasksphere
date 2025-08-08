import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async createBoard(userId: string, createBoardDto: CreateBoardDto) {
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

  async getUserBoards(userId: string) {
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

  async getBoardById(boardId: string, userId: string) {
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
      throw new NotFoundException('Board not found');
    }

    return this.formatBoard(board);
  }

  async updateBoard(boardId: string, userId: string, updateBoardDto: UpdateBoardDto) {
    // Check if user has permission to update the board
    const boardMember = await this.prisma.boardMember.findFirst({
      where: {
        boardId,
        userId,
        role: { in: ['owner', 'admin'] },
      },
    });

    if (!boardMember) {
      throw new ForbiddenException('You do not have permission to update this board');
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

  async deleteBoard(boardId: string, userId: string) {
    // Check if user is the owner
    const board = await this.prisma.board.findFirst({
      where: {
        id: boardId,
        ownerId: userId,
      },
    });

    if (!board) {
      throw new ForbiddenException('You do not have permission to delete this board');
    }

    await this.prisma.board.delete({
      where: { id: boardId },
    });
  }

  private formatBoard(board: any) {
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
}