import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateColumnDto, UpdateColumnDto } from './dto/column.dto';

@Injectable()
export class ColumnsService {
  constructor(private prisma: PrismaService) {}

  async create(createColumnDto: CreateColumnDto, userId: string) {
    // доступ к борду: владелец ИЛИ участник
    const board = await this.prisma.board.findFirst({
      where: {
        id: createColumnDto.boardId,
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
    });
    if (!board) throw new NotFoundException('Board not found');

    return this.prisma.column.create({
      data: {
        ...createColumnDto, // boardId, title, position
      },
      include: {
        cards: { orderBy: { position: 'asc' } },
      },
    });
  }

  async findByBoard(boardId: string, userId: string) {
    const board = await this.prisma.board.findFirst({
      where: {
        id: boardId,
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
    });
    if (!board) throw new NotFoundException('Board not found');

    return this.prisma.column.findMany({
      where: { boardId },
      include: {
        cards: { orderBy: { position: 'asc' } },
      },
      orderBy: { position: 'asc' },
    });
  }

  async update(id: string, updateColumnDto: UpdateColumnDto, userId: string) {
    const column = await this.prisma.column.findFirst({
      where: {
        id,
        board: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } },
          ],
        },
      },
    });
    if (!column) throw new NotFoundException('Column not found');

    return this.prisma.column.update({
      where: { id },
      data: updateColumnDto,
      include: {
        cards: { orderBy: { position: 'asc' } },
      },
    });
  }

  async remove(id: string, userId: string) {
    const column = await this.prisma.column.findFirst({
      where: {
        id,
        board: {
          OR: [
            { ownerId: userId },
            { members: { some: { userId } } },
          ],
        },
      },
    });
    if (!column) throw new NotFoundException('Column not found');

    return this.prisma.column.delete({ where: { id } });
  }
}
