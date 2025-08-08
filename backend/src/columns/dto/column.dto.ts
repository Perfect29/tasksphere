import { IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateColumnDto {
  @IsString()
  title: string;

  @IsUUID()
  boardId: string;

  @IsNumber()
  position: number;
}

export class UpdateColumnDto {
  @IsString()
  title?: string;

  @IsNumber()
  position?: number;
}