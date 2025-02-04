import { Controller, Get, Param } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { WeatherService } from './weather.service';

@SkipThrottle()
@Controller()
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('/weather/:city')
  getCityWeather(@Param('city') city: string) {
    return this.weatherService.getCityWeather(city);
  }

  @Get('/forecast/:city')
  getCityForecast(@Param('city') city: string) {
    return this.weatherService.getCityForecast(city);
  }
}
