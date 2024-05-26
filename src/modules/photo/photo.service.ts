import { Injectable } from '@nestjs/common';
import { DbService } from './../../config';

@Injectable()
export class PhotoService {
  constructor(private readonly dbService: DbService) {}

  async create(createPhotoDto: any) {
    const duplicate = await this.dbService.photo.findFirst({
      where: { id: createPhotoDto.id },
    });
    if (duplicate) {
      return duplicate;
    }
    const photo = await this.dbService.photo.create({
      data: createPhotoDto,
    });
    return photo;
  }
  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [photos, total] = await Promise.all([
      this.dbService.photo.findMany({
        skip,
        take: limit,
        include: {
          tags: { include: { tag: true } },
        },
      }),
      this.dbService.photo.count(),
    ]);

    return {
      data: photos,
      meta: { total: total, limit: limit },
    };
  }
  async findTagPhotos(tagId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const where = {
      tags: {
        some: {
          tagId: tagId,
        },
      },
    };
    const [photos, total] = await Promise.all([
      this.dbService.photo.findMany({
        where,
        skip,
        take: limit,
        include: {
          tags: { include: { tag: true } },
        },
        orderBy: {
          publishedAt: 'desc',
        },
      }),
      this.dbService.photo.count({
        where,
      }),
    ]);

    return {
      data: photos,
      meta: { total: total, limit: limit },
    };
  }
  async getTopTags() {
    const topTags = await this.dbService.tag.findMany({
      orderBy: {
        photos: {
          _count: 'desc',
        },
      },
      take: 10,
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            photos: true,
          },
        },
      },
    });
    const data = topTags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      count: tag._count.photos,
    }));
    return data;
  }

  async delete(id: string) {
    const data = await this.dbService.photo.delete({
      where: { id: id },
    });
    return data;
  }
}
