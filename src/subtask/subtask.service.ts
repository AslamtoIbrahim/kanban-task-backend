import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSubtaskDto } from './dto/create-subtask.dto.js';
import { UpdateSubtaskDto } from './dto/update-subtask.dto.js';

@Injectable()
export class SubtaskService {
  constructor(private prisma: PrismaService) {}
  async create(createSubtaskDto: CreateSubtaskDto) {
    try {
      const existingSubtask = await this.prisma.subtask.findFirst({
        where: {
          title: createSubtaskDto.title,
          taskId: createSubtaskDto.taskId,
        },
      });

      if (existingSubtask) {
        throw new Error('Subtask with this title already exists for this task');
      }

      const newSubtask = await this.prisma.subtask.create({
        data: createSubtaskDto,
      });
      return newSubtask;
    } catch (error) {
      return { error: 'Failed to create subtask', details: error.message };
    }
  }

  async findAll(taskId: string, userId: string) {
    if (!taskId) {
      throw new Error('taskId query parameter is required');
    }
    try {
      const subtasks = await this.prisma.subtask.findMany({
        where: {
          taskId,
          task: {
            status: {
              tag: {
                userId,
              },
            },
          },
        },
      });
      return subtasks;
    } catch (error) {
      return { error: 'Failed to find subtasks', details: error.message };
    }
  }

  async findOne(id: string) {
    if (!id) {
      throw new Error('Subtask id is required');
    }
    try {
      return await this.prisma.subtask.findUnique({
        where: { id },
      });
    } catch (error) {
      return { error: 'Failed to find a subtask', details: error.message };
    }
  }

  async update(id: string, updateSubtaskDto: UpdateSubtaskDto) {
    if (!id) {
      throw new Error('Subtask id is required');
    }
    try {
      return await this.prisma.subtask.update({
        where: { id },
        data: updateSubtaskDto,
      });
    } catch (error) {
      return { error: 'Failed to update subtask', details: error.message };
    }
  }

  async remove(id: string) {
    if (!id) {
      throw new Error('Subtask id is required');
    }
    try {
      const subtask = await this.prisma.subtask.delete({
        where: { id },
      });
      return subtask;
    } catch (error) {
      if (error.code === 'P2025') {
        return { error: 'Subtask not found, maybe it was already deleted' };
      }
      return { error: 'Failed to delete subtask', details: error.message };
    }
  }
}
