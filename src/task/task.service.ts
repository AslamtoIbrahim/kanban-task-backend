import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const existingTask = await this.prisma.task.findFirst({
        where: {
          title: createTaskDto.title,
          statusId: createTaskDto.statusId,
        },
      });
      if (existingTask) {
        throw new Error('Task with this title already exists for this status');
      }
      const task = await this.prisma.task.create({
        data: createTaskDto,
      });
      return task;
    } catch (error) {
      return { error: 'Error creating task', details: error.message };
    }
  }

  async findAll(statusId: string, userId: string) {
    if (!statusId) {
      throw new Error('statusId is required');
    }
    try {
      const task = await this.prisma.task.findMany({
        where: {
          statusId,
          status: { tag: { userId } },
        },
        orderBy: { position: 'asc' },
      });
      return task;
    } catch (error) {
      return { error: 'Error creating task', details: error };
    }
  }

  async findOne(id: string) {
    if (!id) {
      throw new Error('Tag ID is required to find a task');
    }
    try {
      return await this.prisma.task.findUnique({
        where: { id },
      });
    } catch (error) {
      return { error: 'Error finding a task', details: error };
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    if (!id) {
      throw new Error('Tag ID is required to update a task');
    }
    try {
      return await this.prisma.task.update({
        where: { id },
        data: updateTaskDto,
      });
    } catch (error) {
      return { error: 'Error updating a task', details: error };
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.task.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return { error: 'Task not found, maybe it was already deleted' };
      }
      return { error: 'Failed to delete task', details: error.message };
    }
  }
}
