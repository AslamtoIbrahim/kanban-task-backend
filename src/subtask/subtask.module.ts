import { Module } from '@nestjs/common';
import { SubtaskService } from './subtask.service.js';
import { SubtaskController } from './subtask.controller.js';

@Module({
  controllers: [SubtaskController],
  providers: [SubtaskService],
})
export class SubtaskModule {}
