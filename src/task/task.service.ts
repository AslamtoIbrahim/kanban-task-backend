import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { title } from 'process';

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
        data: {
          title: createTaskDto.title,
          description: createTaskDto.description,
          position: createTaskDto.position,
          currentStatus: createTaskDto.currentStatus,
          statusId: createTaskDto.statusId,
          subtasks: {
            create: createTaskDto.subtasks,
          },
        },
      });
      return task;
    } catch (error) {
      return { error: 'Error creating task', details: error.message };
    }
  }

  async findAll(
    statusId: string,
    cursor: string,
    limit: string,
    userId: string,
  ) {
    if (!statusId) {
      throw new Error('statusId is required');
    }
    try {
      const take = parseInt(limit) || 8;
      const tasks = await this.prisma.task.findMany({
        take,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          statusId,
          status: { tag: { userId } },
        },
        include: {
          subtasks: true,
        },
        orderBy: { position: 'asc' },
      });
      return { tasks, nextCursor: tasks[tasks.length - 1]?.id ?? null };
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
        data: {
          title: updateTaskDto.title,
          description: updateTaskDto.description,
          position: updateTaskDto.position,
          currentStatus: updateTaskDto.currentStatus,
          statusId: updateTaskDto.statusId,
          subtasks: {
            update: updateTaskDto.subtasks
              ?.filter((f) => f.id)
              .map((s) => ({
                where: { id: s.id },
                data: {
                  title: s.title,
                  isDone: s.isDone,
                },
              })),
            create: updateTaskDto.subtasks
              ?.filter((f) => !f.id)
              .map((s) => ({
                title: s.title,
                isDone: s.isDone,
              })),
          },

          // subtasks: {
          //   upsert: updateTaskDto.subtasks?.map((s) => ({
          //     where: { id: s.id ?? '00000000-0000-0000-0000-000000000000' },
          //     update: {
          //       title: s.title,
          //       isDone: s.isDone,
          //     },
          //     create: {
          //       title: s.title,
          //       isDone: s.isDone,
          //       taskId: id,
          //     },
          //   })),
          // },
        },
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
