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
}
