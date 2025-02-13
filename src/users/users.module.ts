import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ThirdPartyModule } from 'src/third-party/third-party.module';
import { UsersResolver } from './user.resolver';

@Module({
  imports: [PrismaModule, LoggerModule, ThirdPartyModule, JwtModule],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
