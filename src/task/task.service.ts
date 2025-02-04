import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TaskService {
  constructor(private readonly userService: UsersService) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  handleCron() {
    this.userService.updateFavoriteData();
  }
}
