import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // try {
    await this.$connect();
    console.log('Connected to postgres...');
    // } catch (error) {
    //   console.error('Error connecting to postgres... \n', error);
    // }
  }
}
