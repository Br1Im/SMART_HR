import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';

@Injectable()
export class BlocksService {
  constructor(private prisma: PrismaService) {}

  async findAll(courseId: string) {
    return this.prisma.block.findMany({
      where: { courseId },
      orderBy: { position: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.block.findUnique({
      where: { id },
      include: { course: true },
    });
  }

  async create(createBlockDto: any) {
    const maxPositionBlock = await this.prisma.block.findFirst({
      where: { courseId: createBlockDto.courseId },
      orderBy: { position: 'desc' },
    });

    const position = maxPositionBlock ? maxPositionBlock.position + 1 : 1;

    return this.prisma.block.create({
      data: {
        ...createBlockDto,
        position,
      },
    });
  }

  async update(id: string, updateBlockDto: any) {
    return this.prisma.block.update({
      where: { id },
      data: updateBlockDto,
    });
  }

  async remove(id: string) {
    return this.prisma.block.delete({
      where: { id },
    });
  }

  async reorder(courseId: string, blockIds: string[]) {
    const updatePromises = blockIds.map((blockId, index) =>
      this.prisma.block.update({
        where: { id: blockId },
        data: { position: index + 1 },
      })
    );

    return Promise.all(updatePromises);
  }
}