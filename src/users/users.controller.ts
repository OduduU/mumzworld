import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import {
  AddFavoriteLocationDto,
  CreateUserDto,
  UserLoginDto,
} from './dto/user.dto';
import { AuthGuard } from '../auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  createUser(
    @Body(ValidationPipe)
    createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Post('signin')
  userLogin(
    @Body(ValidationPipe)
    userLoginDto: UserLoginDto,
  ) {
    return this.usersService.signin(userLoginDto);
  }

  @Get('locations')
  @UseGuards(AuthGuard)
  getLocations(@Req() request: Request) {
    return this.usersService.getFavorites(request);
  }

  @Post('locations')
  @UseGuards(AuthGuard)
  addFavorite(
    @Body(ValidationPipe)
    userLoginDto: AddFavoriteLocationDto,
    @Req() request: Request,
  ) {
    return this.usersService.addFavoriteLocation(userLoginDto, request);
  }

  @Delete('/locations/:id')
  @UseGuards(AuthGuard)
  deleteOne(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    return this.usersService.delete(id, request);
  }
}
