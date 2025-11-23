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
          title: createTagDto.title,
          statuses: {
            // relation tag <=> status
            create: createTagDto.statuses, // tagId generate autho
          },
          userId: userId,
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          statuses: true,
        },
      });
      return newTag;
    } catch (error) {
      return { error: 'Failed to create new tag', details: error.message };
    }
  }

  async findAll(userId: string, limit: string, cursor: string) {
    if (!userId) {
      throw new Error('User ID is required to create a tag');
    }
    try {
      const take = parseInt(limit) || 6;

      const tags = await this.prisma.tag.findMany({
        take,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          userId: userId,
        },
        orderBy: { id: 'asc' },
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          statuses: true,
        },
      });
      // if (!tags || tags.length === 0) {
      //   return { tags: [], nextCursor: null };
      // }
      return { tags, nextCursor: tags[tags.length - 1]?.id ?? null };
    } catch (error) {
      return { error: 'Failed to find tags', details: error.message };
    }
  }

  async chekTag(title: string, userId: string) {
    if (!userId) {
      throw new Error('User ID is required to check a tag');
    }
    try {
      if (!title) {
        throw new Error('Tag title is required to find a tag');
      }
      const existingTag = await this.prisma.tag.findFirst({
        where: {
          title,
        },
      });

      return { exist: !!existingTag, id: existingTag?.id };
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

  async deleteStatues(id: string, updateTagDto: UpdateTagDto) {
    const oldIdStatuses = await this.prisma.status.findMany({
      where: { tagId: id },
      select: { id: true },
    });

    const incomingIds = updateTagDto.statuses
      ?.filter((s) => s.id)
      .map((s) => s.id);

    return oldIdStatuses
      .filter((os) => !incomingIds?.includes(os.id))
      .map((os) => os.id);
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    if (!id) {
      throw new Error('Tag ID is required to update a tag');
    }
    try {
      const deletedIds = await this.deleteStatues(id, updateTagDto);

      const tag = await this.prisma.tag.update({
        where: { id: id },
        data: {
          title: updateTagDto.title,
          statuses: {
            delete: deletedIds.map((d) => ({ id: d })),
            update: updateTagDto.statuses
              ?.filter((f) => f.id)
              .map((s) => ({
                where: {
                  id: s.id,
                },
                data: {
                  title: s.title,
                  color: s.color,
                  position: s.position,
                },
              })),
            create: updateTagDto.statuses
              ?.filter((f) => !f.id)
              .map((s) => ({
                title: s.title,
                color: s.color,
                position: s.position,
              })),
          },
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          statuses: true,
        },
      });
      return tag;
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
