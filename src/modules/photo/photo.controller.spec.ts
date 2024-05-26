import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import {
  DbService,
  DbModule,
  EnvConfigService,
  EnvConfigModule,
} from '../../config';
import { FlickrService } from './flickr.service';

describe('PhotoController', () => {
  let app: INestApplication;
  let photoService: PhotoService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [DbModule, EnvConfigModule],
      controllers: [PhotoController],
      providers: [PhotoService, DbService, FlickrService, EnvConfigService],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    photoService = moduleRef.get<PhotoService>(PhotoService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /photo/top-tags', () => {
    it('should return the top tags', async () => {
      const topTags = [
        { id: '1', name: 'tag1', count: 5 },
        { id: '2', name: 'tag2', count: 3 },
      ];

      jest.spyOn(photoService, 'getTopTags').mockResolvedValueOnce(topTags);

      const response = await request(app.getHttpServer()).get(
        '/photo/top-tags',
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(topTags);
    });
  });

  describe('GET /photo', () => {
    it('should return photos with pagination metadata', async () => {
      const photosWithPagination = { data: [], meta: { total: 0, limit: 10 } };
      jest
        .spyOn(photoService, 'findAll')
        .mockResolvedValueOnce(photosWithPagination);

      const response = await request(app.getHttpServer())
        .get('/photo')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(photosWithPagination);
    });

    it('should return photos with a specific tag with pagination metadata', async () => {
      const tagPhotosWithPagination = {
        data: [],
        meta: { total: 0, limit: 10 },
      };
      jest
        .spyOn(photoService, 'findTagPhotos')
        .mockResolvedValueOnce(tagPhotosWithPagination);

      const response = await request(app.getHttpServer())
        .get('/photo')
        .query({ page: 1, limit: 10, tagId: '123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(tagPhotosWithPagination);
    });
  });
});
