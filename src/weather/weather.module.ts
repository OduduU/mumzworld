import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { ThirdPartyModule } from 'src/third-party/third-party.module';

@Module({
  imports: [ThirdPartyModule],
  providers: [WeatherService],
  controllers: [WeatherController],
})
export class WeatherModule {}
