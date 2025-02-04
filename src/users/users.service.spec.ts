import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { mockDeep } from 'jest-mock-extended';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ThirdPartyService } from '../third-party/third-party.service';

const mockPrisma = mockDeep<PrismaService>();
const mockJwt = mockDeep<JwtService>();
const mockCache = mockDeep<Cache>();
const mockThirdPartyService = mockDeep<ThirdPartyService>();

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
        { provide: CACHE_MANAGER, useValue: mockCache },
        { provide: ThirdPartyService, useValue: mockThirdPartyService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      jest.spyOn<any, any>(service, 'hashing').mockResolvedValue('hashed');
      mockPrisma.user.create.mockResolvedValue({
        id: 1,
        name: 'Odudu',
        email: 'test@test.com',
        password: 'hashed',
      });

      const result = await service.create({
        name: 'Odudu',
        email: 'test@test.com',
        password: 'password',
      });

      expect(result).toEqual({
        id: 1,
        name: 'Odudu',
        email: 'test@test.com',
        password: undefined,
      });
    });

    it('should throw an error if user already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Odudu',
        email: 'test@test.com',
        password: 'hashed',
      });

      await expect(
        service.create({
          name: 'Odudu',
          email: 'test@test.com',
          password: 'password',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('signin', () => {
    it('should return a user with a token on successful login', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Odudu',
        email: 'test@test.com',
        password: 'hashed',
      });
      jest.spyOn<any, any>(service, 'compareHash').mockResolvedValue(true);
      mockJwt.sign.mockReturnValue('signin-token');

      const result = await service.signin({
        email: 'test@test.com',
        password: 'password',
      });

      expect(result).toEqual({
        id: 1,
        name: 'Odudu',
        email: 'test@test.com',
        password: undefined,
        token: 'signin-token',
      });
    });

    it('should throw an error if email is incorrect', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(
        service.signin({ email: 'wrong@test.com', password: 'password' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if password is incorrect', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        name: 'Odudu',
        email: 'test@test.com',
        password: 'hashed',
      });
      jest.spyOn<any, any>(service, 'compareHash').mockResolvedValue(false);

      await expect(
        service.signin({
          email: 'test@test.com',
          password: 'incorrect-password',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Favorite Locations', () => {
    it('should add a favorite location', async () => {
      mockPrisma.favorite.findFirst.mockResolvedValue(null);
      mockPrisma.favorite.create.mockResolvedValue({
        id: 1,
        city: 'lagos',
        authorId: 1,
        createdAt: new Date('2025-02-03T18:57:34.726Z'),
        updatedAt: new Date('2025-02-03T18:57:34.726Z'),
        description: null,
      });

      const result = await service.addFavoriteLocation(
        { id: 1, city: 'lagos' },
        { user: { id: '1', email: 'test@test.com' } } as any,
      );

      expect(result).toEqual({
        id: 1,
        city: 'lagos',
        authorId: 1,
        createdAt: new Date('2025-02-03T18:57:34.726Z'),
        updatedAt: new Date('2025-02-03T18:57:34.726Z'),
        description: null,
      });
    });

    it('should throw UnauthorizedException if user ID does not match', async () => {
      await expect(
        service.addFavoriteLocation({ id: 2, city: 'Paris' }, {
          user: { id: '1' },
        } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should retrieve favorite locations', async () => {
      mockPrisma.favorite.findMany.mockResolvedValue([
        {
          id: 1,
          city: 'lagos',
          authorId: 1,
          createdAt: new Date('2025-02-03T18:57:34.726Z'),
          updatedAt: new Date('2025-02-03T18:57:34.726Z'),
          description: null,
        },
      ]);

      const result = await service.getFavorites({
        user: { id: '1' },
      } as any);

      expect(result).toEqual([
        {
          id: 1,
          city: 'lagos',
          authorId: 1,
          createdAt: new Date('2025-02-03T18:57:34.726Z'),
          updatedAt: new Date('2025-02-03T18:57:34.726Z'),
          description: null,
        },
      ]);
    });

    it('should delete favorite location', async () => {
      mockPrisma.favorite.delete.mockResolvedValue({
        id: 1,
        city: 'lagos',
        authorId: 1,
        createdAt: new Date('2025-02-03T18:57:34.726Z'),
        updatedAt: new Date('2025-02-03T18:57:34.726Z'),
        description: null,
      });

      const result = await service.delete(1, {
        user: { id: '1' },
      } as any);

      expect(result).toEqual({
        id: 1,
        city: 'lagos',
        authorId: 1,
        createdAt: new Date('2025-02-03T18:57:34.726Z'),
        updatedAt: new Date('2025-02-03T18:57:34.726Z'),
        description: null,
      });
    });
  });

  describe('updateFavoriteData', () => {
    it('should fetch and update weather data', async () => {
      mockPrisma.favorite.findMany.mockResolvedValue([
        {
          id: 1,
          city: 'lagos',
          authorId: 1,
          createdAt: new Date('2025-02-03T18:57:34.726Z'),
          updatedAt: new Date('2025-02-03T18:57:34.726Z'),
          description: null,
        },
      ]);
      mockCache.get.mockResolvedValue(null);
      mockThirdPartyService.getCityWeather.mockResolvedValue({
        location: {
          name: 'Lagos',
          region: 'Lagos',
          country: 'Nigeria',
          lat: 6.4531,
          lon: 3.3958,
          tz_id: 'Africa/Lagos',
        },
        current: {
          temp_c: 25.1,
          temp_f: 77.2,
          is_day: 0,
        },
      });

      await service.updateFavoriteData();

      expect(mockThirdPartyService.getCityWeather).toHaveBeenCalledWith(
        'lagos',
      );
      expect(mockCache.set).toHaveBeenCalledWith(
        'lagos_weather',
        {
          location: {
            name: 'Lagos',
            region: 'Lagos',
            country: 'Nigeria',
            lat: 6.4531,
            lon: 3.3958,
            tz_id: 'Africa/Lagos',
          },
          current: {
            temp_c: 25.1,
            temp_f: 77.2,
            is_day: 0,
          },
        },
        1200000,
      );
    });
  });
});
