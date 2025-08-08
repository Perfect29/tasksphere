import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto, UpdateCardDto, MoveCardDto } from './dto/card.dto';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async createCard(userId: string, createCardDto: CreateCardDto) {
    // Check if user has access to the board
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
      throw new ForbiddenException('You do not have access to this board');
    }

    // Get the next position for the card
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

  async updateCard(cardId: string, userId: string, updateCardDto: UpdateCardDto) {
    // Check if user has access to the card
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
      throw new NotFoundException('Card not found or access denied');
    }

    const data: any = {};
    if (updateCardDto.title !== undefined) data.title = updateCardDto.title;
    if (updateCardDto.description !== undefined) data.description = updateCardDto.description;
    if (updateCardDto.columnId !== undefined) data.columnId = updateCardDto.columnId;
    if (updateCardDto.position !== undefined) data.position = updateCardDto.position;
    if (updateCardDto.assignedTo !== undefined) data.assignedTo = updateCardDto.assignedTo ?? null;
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

  async deleteCard(cardId: string, userId: string) {
    // Check if user has access to the card
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
      throw new NotFoundException('Card not found or access denied');
    }

    await this.prisma.card.delete({
      where: { id: cardId },
    });
  }

  async moveCard(cardId: string, userId: string, moveCardDto: MoveCardDto) {
    // Check if user has access to both source and destination columns
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
      throw new NotFoundException('Card not found or access denied');
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
      throw new ForbiddenException('You do not have access to the target column');
    }

    // Update card positions in a transaction
    await this.prisma.$transaction(async (prisma) => {
      // If moving to a different column
      if (card.columnId !== moveCardDto.columnId) {
        // Update positions in the source column
        await prisma.card.updateMany({
          where: {
            columnId: card.columnId,
            position: { gt: card.position },
          },
          data: {
            position: { decrement: 1 },
          },
        });

        // Update positions in the target column
        await prisma.card.updateMany({
          where: {
            columnId: moveCardDto.columnId,
            position: { gte: moveCardDto.position },
          },
          data: {
            position: { increment: 1 },
          },
        });
      } else {
        // Moving within the same column
        if (moveCardDto.position > card.position) {
          // Moving down
          await prisma.card.updateMany({
            where: {
              columnId: card.columnId,
              position: { gt: card.position, lte: moveCardDto.position },
            },
            data: {
              position: { decrement: 1 },
            },
          });
        } else if (moveCardDto.position < card.position) {
          // Moving up
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

      // Update the card itself
      await prisma.card.update({
        where: { id: cardId },
        data: {
          columnId: moveCardDto.columnId,
          position: moveCardDto.position,
        },
      });
    });

    // Return the updated card
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

  private formatCard(card: any) {
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
}