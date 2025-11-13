import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { Session } from '@thallesp/nestjs-better-auth';
import { CreateStatusDto } from './dto/create-status.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { StatusService } from './status.service.js';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  create(@Body() createStatusDto: CreateStatusDto) {
    return this.statusService.create(createStatusDto);
  }

  @Get()
  findAll(@Query('tagId') tagId: string, @Session() session: UserSession) {
    return this.statusService.findAll(tagId, session.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Session() session: UserSession) {
    return this.statusService.findOne(id, session.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
    return this.statusService.update(id, updateStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statusService.remove(id);
  }
}
