import { Test, TestingModule } from '@nestjs/testing';
import { PhotoService } from './photo.service';
import { DbService } from '../../config';

describe('PhotoService', () => {
  let service: PhotoService;
  let dbService: DbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotoService,
        {
          provide: DbService,
          useValue: {
            photo: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PhotoService>(PhotoService);
    dbService = module.get<DbService>(DbService);
  });

  describe('findAll', () => {
    it('should return photos with pagination metadata', async () => {
      const photos = [
        {
          id: '1',
          imageUrl: 'url',
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: [],
        },
      ].map((photo) => ({
        ...photo,
        updated_at: photo.updatedAt,
      }));
      const total = 1;
      jest.spyOn(dbService.photo, 'findMany').mockResolvedValueOnce(photos);
      jest.spyOn(dbService.photo, 'count').mockResolvedValueOnce(total);

      const result = await service.findAll(1, 10);
      expect(result).toEqual({
        data: photos,
        meta: { total: total, limit: 10 },
      });
      expect(dbService.photo.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        include: {
          tags: { include: { tag: true } },
        },
        orderBy: {
          publishedAt: 'desc',
        },
      });
      expect(dbService.photo.count).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      const photos = [];
      const total = 0;
      jest.spyOn(dbService.photo, 'findMany').mockResolvedValueOnce(photos);
      jest.spyOn(dbService.photo, 'count').mockResolvedValueOnce(total);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: photos,
        meta: { total: total, limit: 10 },
      });
    });
  });

  describe('findTagPhotos', () => {
    it('should return photos with a specific tag with pagination metadata', async () => {
      const tagId = 'tagId';
      const photos = [
        { id: '1', imageUrl: 'url', publishedAt: new Date(), tags: [] },
      ].map((photo) => ({
        ...photo,
        createdAt: new Date(),
        updated_at: new Date(),
      }));
      const total = 1;
      jest.spyOn(dbService.photo, 'findMany').mockResolvedValueOnce(photos);
      jest.spyOn(dbService.photo, 'count').mockResolvedValueOnce(total);

      const result = await service.findTagPhotos(tagId, 1, 10);
      expect(result).toEqual({
        data: photos,
        meta: { total: total, limit: 10 },
      });
      expect(dbService.photo.findMany).toHaveBeenCalledWith({
        where: {
          tags: {
            some: {
              tagId: tagId,
            },
          },
        },
        skip: 0,
        take: 10,
        include: {
          tags: { include: { tag: true } },
        },
        orderBy: {
          publishedAt: 'desc',
        },
      });
      expect(dbService.photo.count).toHaveBeenCalledWith({
        where: {
          tags: {
            some: {
              tagId: tagId,
            },
          },
        },
      });
    });

    it('should handle empty results', async () => {
      const tagId = 'tagId';
      const photos = [];
      const total = 0;
      jest.spyOn(dbService.photo, 'findMany').mockResolvedValueOnce(photos);
      jest.spyOn(dbService.photo, 'count').mockResolvedValueOnce(total);

      const result = await service.findTagPhotos(tagId, 1, 10);

      expect(result).toEqual({
        data: photos,
        meta: { total: total, limit: 10 },
      });
    });
  });
});
