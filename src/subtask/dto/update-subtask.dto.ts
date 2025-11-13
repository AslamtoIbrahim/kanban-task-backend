import { PartialType } from '@nestjs/mapped-types';
import { CreateSubtaskDto } from './create-subtask.dto.js';

export class UpdateSubtaskDto extends PartialType(CreateSubtaskDto) {}
