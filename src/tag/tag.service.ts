import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTagDto } from './dto/create-tag.dto.js';
import { UpdateTagDto } from './dto/update-tag.dto.js';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto, userId: string) {
    if (!userId) {
      throw new Error('User ID is required to create a tag');
    }
    try {
      const existingTag = await this.prisma.tag.findFirst({
        where: {
          title: createTagDto.title,
          userId: userId,
        },
      });
      if (existingTag) {
        throw new Error('Tag with this title already exists for this user');
      }
      const newTag = await this.prisma.tag.create({
        data: {
          ...createTagDto,
          userId: userId,
        },
      });
      return newTag;
    } catch (error) {
      return { error: 'Failed to create new tag', details: error.message };
    }
  }

  async findAll(userId: string) {
    if (!userId) {
      throw new Error('User ID is required to create a tag');
    }
    try {
      return await this.prisma.tag.findMany({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      return { error: 'Failed to find tags', details: error.message };
    }
  }

  async chekTag(title: string) {
    try {
      if (!title) {
        throw new Error('Tag title is required to find a tag');
      }
      const existingTag = await this.prisma.tag.findFirst({
        where: {
          title,
        },
      });

      return { exist: !!existingTag };
    } catch (error) {
      return {
        error: 'Failed to find tag with this title',
        details: error.message,
      };
    }
  }

  async findOne(id: string) {
    if (!id) {
      throw new Error('Tag ID is required to find a tag');
    }
    try {
      return await this.prisma.tag.findUnique({
        where: { id: id },
      });
    } catch (error) {
      return {
        error: 'Failed to find tag with this id',
        details: error.message,
      };
    }
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    if (!id) {
      throw new Error('Tag ID is required to update a tag');
    }
    try {
      return await this.prisma.tag.update({
        where: { id: id },
        data: { ...updateTagDto },
      });
    } catch (error) {
      return {
        error: 'Failed to update tag with this id',
        details: error.message,
      };
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.tag.delete({
        where: { id: id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return { error: 'Tag not found, maybe it was already deleted' };
      }
      return { error: 'Failed to delete tag', details: error.message };
    }
  }
}
