import { IsInt, IsOptional, IsEnum, Min } from 'class-validator';
import { TableStatus } from '../entities/table.entity';

export class CreateTableDto {
  @IsInt()
  @Min(1)
  number!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsEnum(TableStatus)
  status?: TableStatus;
}

export class UpdateTableDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  number?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsEnum(TableStatus)
  status?: TableStatus;
}
