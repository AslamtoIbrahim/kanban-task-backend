import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateStatusDto } from './dto/create-status.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';

@Injectable()
export class StatusService {
  constructor(private prisma: PrismaService) {}

  async create(createStatusDto: CreateStatusDto) {
    try {
      const existingStatus = await this.prisma.status.findFirst({
        where: {
          title: createStatusDto.title,
          tagId: createStatusDto.tagId,
        },
      });

      if (existingStatus) {
        throw new Error('Status with this title already exists for this user');
      }

      const status = await this.prisma.status.create({
        data: {
          ...createStatusDto,
        },
      });

      return status;
    } catch (error) {
      return { error: 'Error creating status', details: error.message };
    }
  }

  async findAll(tagId: string, cursor: string, limit: string, userId: string) {
    if (!userId) {
      throw new Error('User ID is required to fetch all statuses');
    }
    if (!tagId) {
      return { error: 'tagId is required' };
    }
    try {
      const take = parseInt(limit) || 3;
      const statuses = await this.prisma.status.findMany({
        take,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          tagId,
          tag: { userId },
        },
        orderBy: { position: 'asc' },
        include: {
          tasks: true,
        },
      });

      if (!statuses) {
        return { statuses: [], nextCursor: null };
      }

      const nextCursor = statuses[statuses.length - 1]?.id ?? null;

      return { statuses, nextCursor };
    } catch (error) {
      return { error: 'Error finding statuses', details: error.message };
    }
  }

  async checkStatus(title: string, tagId: string, userId: string) {
    if (!userId) {
      throw new Error('User ID is required to check status');
    }
    try {
      if (!title) {
        throw new Error('Status title is required to find a status');
      }
      const existingStatus = await this.prisma.status.findFirst({
        where: {
          title,
          tagId,
        },
      });

      return { exist: !!existingStatus, id: existingStatus?.id };
    } catch (error) {
      return {
        error: 'Failed to find statuse with this title',
        details: error.message,
      };
    }
  }

  async findOne(id: string, userId: string) {
    if (!id) {
      return { error: 'Status ID is required' };
    }
    try {
      return await this.prisma.status.findUnique({
        where: { id, tag: { userId } },
      });
    } catch (error) {
      return { error: 'Error finding a status', details: error };
    }
  }

  async update(id: string, updateStatusDto: UpdateStatusDto) {
    if (!id) {
      return { error: 'Status ID is required' };
    }
    try {
      return await this.prisma.status.update({
        where: { id },
        data: updateStatusDto,
      });
    } catch (error) {
      return { error: 'Error update a status', details: error };
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.status.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return { error: 'Status not found, maybe it was already deleted' };
      }
      return { error: 'Failed to delete status', details: error.message };
    }
  }
}
