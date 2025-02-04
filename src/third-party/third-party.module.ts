import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ThirdPartyService } from './third-party.service';

@Module({
  imports: [HttpModule],
  providers: [ThirdPartyService],
  exports: [ThirdPartyService],
})
export class ThirdPartyModule {}
