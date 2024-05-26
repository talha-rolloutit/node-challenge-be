import { Injectable } from '@nestjs/common';
import { EnvConfigService } from '../../config';
import { createFlickr } from 'flickr-sdk';

@Injectable()
export class FlickrService {
  constructor(private readonly envConfigService: EnvConfigService) {}
  async searchCatPhotos(page: string, limit: string) {
    const { flickr } = createFlickr(this.envConfigService.flickrApiKey);
    return await flickr('flickr.photos.search', {
      tags: 'cat',
      per_page: limit,
      page: page,
    });
  }
  async getPhotoInfo(id: string) {
    const { flickr } = createFlickr(this.envConfigService.flickrApiKey);
    const [photoInfo, imgUrls] = await Promise.all([
      flickr('flickr.photos.getInfo', { photo_id: id }),
      flickr('flickr.photos.getSizes', { photo_id: id }),
    ]);

    const photo = {
      imageUrl: imgUrls.sizes.size[imgUrls.sizes.size.length - 1].source,
      publishedAt: new Date(parseInt(photoInfo.photo.dates.posted) * 1000),
      id: photoInfo.photo.id,

      tags: {
        create: photoInfo.photo.tags.tag.map((photoTag) => {
          return {
            tag: {
              connectOrCreate: {
                where: { name: photoTag._content },
                create: { name: photoTag._content, id: photoTag.id },
              },
            },
          };
        }),
      },
    };
    return photo;
  }
}
