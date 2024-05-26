import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { FlickrService } from './flickr.service';
import { PhotoService } from './photo.service';
import { Prisma } from '@prisma/client';
import { FindPhotosDto } from './dto/find-photo.dto';

@Controller('photo')
export class PhotoController {
  constructor(
    private readonly flickerService: FlickrService,
    private readonly photoService: PhotoService,
  ) {}

  @Get('flickr')
  async searchCatPhotos() {
    const { page, limit } = { page: '1', limit: '10' };
    const searchImgs = await this.flickerService.searchCatPhotos(page, limit);
    return await this.flickerService.getPhotoInfo(
      searchImgs.photos.photo[0].id,
    );
  }
  @Post()
  async create(@Body() createPhotoDto: Prisma.PhotoCreateInput) {
    const data = await this.photoService.create(createPhotoDto);
    return data;
  }
  @Get('top-tags')
  async findTopTags() {
    const data = await this.photoService.getTopTags();
    return data;
  }

  @Get()
  async findAll(@Query() query: FindPhotosDto) {
    const { page, limit, tagId } = query;
    if (tagId) {
      return this.photoService.findTagPhotos(tagId, page, limit);
    } else {
      return this.photoService.findAll(page, limit);
    }
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.photoService.delete(id);
  }
}
