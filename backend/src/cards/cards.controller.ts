import { Controller, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CardsService } from './cards.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCardDto, UpdateCardDto, MoveCardDto } from './dto/card.dto';

@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Post()
  async createCard(@Request() req, @Body() createCardDto: CreateCardDto) {
    return this.cardsService.createCard(req.user.userId, createCardDto);
  }

  @Patch(':id')
  async updateCard(
    @Param('id') cardId: string,
    @Request() req,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardsService.updateCard(cardId, req.user.userId, updateCardDto);
  }

  @Delete(':id')
  async deleteCard(@Param('id') cardId: string, @Request() req) {
    return this.cardsService.deleteCard(cardId, req.user.userId);
  }

  @Patch(':id/move')
  async moveCard(
    @Param('id') cardId: string,
    @Request() req,
    @Body() moveCardDto: MoveCardDto,
  ) {
    return this.cardsService.moveCard(cardId, req.user.userId, moveCardDto);
  }
}