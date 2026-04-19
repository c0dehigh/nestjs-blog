<<<<<<< HEAD
=======
import { Type } from 'class-transformer';
>>>>>>> b1e850c4300fd13821021324039f3d0f0102f38e
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  limit?: number = 10;

  @IsOptional()
  @IsPositive()
  page?: number = 1;
}
