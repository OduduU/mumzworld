import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { genSalt, hash, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  AddFavoriteLocationDto,
  CreateUserDto,
  UserLoginDto,
} from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ThirdPartyService } from '../third-party/third-party.service';

interface RequestWithUserPayload extends Request {
  user?: {
    id: string;
    email: string;
  };
}

@Injectable()
export class UsersService {
  private saltRound = process.env.SALT_ROUND || '12';
  private jwtKey = process.env.JWT_KEY;
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly thirdPartyApiService: ThirdPartyService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExist = await this.prismaService.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (userExist) {
      throw new BadRequestException('Email already exist');
    }

    createUserDto.password = await this.hashing(createUserDto.password);

    const newUser = await this.prismaService.user.create({
      data: createUserDto,
    });

    const dataToSend = {
      ...newUser,
      password: undefined,
    };

    return dataToSend;
  }

  async signin(userLoginDto: UserLoginDto) {
    const userExist = await this.prismaService.user.findUnique({
      where: {
        email: userLoginDto.email,
      },
    });

    if (!userExist) {
      throw new BadRequestException('Invalid email or password');
    }

    const validPassword = await this.compareHash(
      userLoginDto.password,
      userExist.password,
    );

    if (!validPassword)
      throw new BadRequestException('Invalid email or password');

    const userJwt = this.jwtService.sign(
      {
        id: userExist.id,
        email: userExist.email,
      },
      {
        secret: this.jwtKey,
        expiresIn: '5h',
      },
    );

    const dataToSend = {
      ...userExist,
      password: undefined,
      token: userJwt,
    };

    return dataToSend;
  }

  async addFavoriteLocation(
    addFavoriteDto: AddFavoriteLocationDto,
    request: RequestWithUserPayload,
  ) {
    if (Number(request.user?.id) !== addFavoriteDto.id) {
      throw new UnauthorizedException();
    }

    const favoriteExist = await this.prismaService.favorite.findFirst({
      where: {
        authorId: addFavoriteDto.id,
        city: addFavoriteDto.city.toLowerCase(),
      },
    });

    if (favoriteExist) return favoriteExist;

    return this.prismaService.favorite.create({
      data: {
        city: addFavoriteDto.city.toLowerCase(),
        ...(addFavoriteDto.description && {
          description: addFavoriteDto.description,
        }),
        author: {
          connect: { id: addFavoriteDto.id },
        },
      },
    });
  }

  async getFavorites(request: RequestWithUserPayload) {
    return this.prismaService.favorite.findMany({
      where: {
        authorId: Number(request.user?.id),
      },
    });
  }

  async delete(id: number, request: RequestWithUserPayload) {
    return this.prismaService.favorite.delete({
      where: { id, authorId: Number(request.user?.id) },
    });
  }

  async updateFavoriteData() {
    const favoriteCities = await this.prismaService.favorite.findMany({
      distinct: ['city'],
      select: {
        city: true,
      },
    });

    for (const fav of favoriteCities) {
      const cacheKey = `${fav.city}_weather`;

      const cachedWeather = await this.cacheManager.get(cacheKey);

      if (cachedWeather) {
        continue;
      }

      const cityWeatherData = await this.thirdPartyApiService.getCityWeather(
        fav.city,
      );

      await this.cacheManager.set(cacheKey, cityWeatherData, 1200000);
    }
  }

  private async hashing(data: string) {
    const SALT_ROUND = parseInt(this.saltRound, 10);
    const salt = await genSalt(SALT_ROUND);

    return hash(data, salt);
  }

  private async compareHash(supplied: string, stored: string) {
    const validHash = await compare(supplied, stored);

    return validHash;
  }
}
