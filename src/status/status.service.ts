import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class StatusService {
  constructor(private prisma: PrismaService) {}

  async create(createStatusDto: CreateStatusDto) {
    try {
      const existingStatus = await this.prisma.status.findFirst({
        where: {
          title: createStatusDto.title,
          tagId: createStatusDto.tagId,
        }
      })

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

  async findAll(tagId: string, userId: string) {
    if (!tagId) {
      return { error: 'tagId is required' };
    }
    try {
      return await this.prisma.status.findMany({
        where: {
          tagId,
          tag: { userId },
        },
        orderBy: { position: 'asc' },
      });
    } catch (error) {
      return { error: 'Error finding statuses', details: error };
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
