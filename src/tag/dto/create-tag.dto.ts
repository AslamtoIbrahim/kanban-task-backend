import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  statuses?: { id: string; title: string; color: string; position: number }[];
}
