import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubtaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  isDone: boolean;

  @IsString()
  @IsNotEmpty()
  taskId: string;
}
