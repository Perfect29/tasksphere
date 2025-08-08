import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto, UpdateColumnDto } from './dto/column.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('columns')
@UseGuards(JwtAuthGuard)
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  create(@Body() createColumnDto: CreateColumnDto, @Request() req) {
    return this.columnsService.create(createColumnDto, req.user.userId);
  }

  @Get('board/:boardId')
  findByBoard(@Param('boardId') boardId: string, @Request() req) {
    return this.columnsService.findByBoard(boardId, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateColumnDto: UpdateColumnDto,
    @Request() req,
  ) {
    return this.columnsService.update(id, updateColumnDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.columnsService.remove(id, req.user.userId);
  }
}