import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Post()
  async createBoard(@Request() req, @Body() createBoardDto: CreateBoardDto) {
    return this.boardsService.createBoard(req.user.userId, createBoardDto);
  }

  @Get()
  async getUserBoards(@Request() req) {
    return this.boardsService.getUserBoards(req.user.userId);
  }

  @Get(':id')
  async getBoardById(@Param('id') boardId: string, @Request() req) {
    return this.boardsService.getBoardById(boardId, req.user.userId);
  }

  @Patch(':id')
  async updateBoard(
    @Param('id') boardId: string,
    @Request() req,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    return this.boardsService.updateBoard(boardId, req.user.userId, updateBoardDto);
  }

  @Delete(':id')
  async deleteBoard(@Param('id') boardId: string, @Request() req) {
    return this.boardsService.deleteBoard(boardId, req.user.userId);
  }
}