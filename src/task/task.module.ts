import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
