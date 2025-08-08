import { IsOptional, IsString, IsNumber, IsISO8601} from 'class-validator';
import { Type } from 'class-transformer';
import { IsUUID } from 'class-validator';


export class CreateCardDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  // В схеме String(cuid), НЕ UUID
  @IsString()
  columnId: string;

  // Если приходит строкой — сконвертить в число
  @Type(() => Number)
  @IsNumber()
  position: number;

  // Card.assignedTo: String? (User.id)
  @IsOptional()
  @IsString()
  assignedTo?: string;

  // Card.dueDate: DateTime?
  @IsOptional()
  @IsISO8601()
  dueDate?: string; // конвертим в Date в сервисе
}


export class UpdateCardDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() columnId?: string;

  @IsOptional() @Type(() => Number) @IsNumber()
  position?: number;

  @IsOptional() @IsString()
  assignedTo?: string | null;

  @IsOptional() @IsISO8601()
  dueDate?: string | null; 
}

export class MoveCardDto {
  @IsUUID()
  columnId: string;

  @IsNumber()
  position: number;
}