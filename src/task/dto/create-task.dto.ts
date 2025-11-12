import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsInt()
  @IsNotEmpty()
  position: number;

  @IsString()
  @IsNotEmpty()
  currentStatus: string;

  @IsString()
  @IsNotEmpty()
  statusId: string;
}
