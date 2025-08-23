import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUserEventsDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1; // default

  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageSize: number = 10; // default

  @IsOptional()
  @IsString()
  sort?: string; // e.g. "date:asc" or "name:desc"

  @IsOptional()
  @IsString()
  status?: string; // e.g. "pending", "completed"
}

