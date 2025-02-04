import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ThirdPartyService } from '../third-party/third-party.service';

@Injectable()
export class WeatherService {
  constructor(
    private readonly thirdPartyApiService: ThirdPartyService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getCityWeather(city: string) {
    const cacheKey = `${city.toLowerCase()}_weather`;

    const cachedWeather = await this.cacheManager.get(cacheKey);

    if (cachedWeather) {
      return cachedWeather;
    }

    const apiWeatherData = await this.thirdPartyApiService.getCityWeather(city);

    await this.cacheManager.set(cacheKey, apiWeatherData, 600000);

    return apiWeatherData;
  }

  async getCityForecast(city: string) {
    const cacheKey = `${city.toLowerCase()}_weather_forecast`;

    const cachedWeather = await this.cacheManager.get(cacheKey);

    if (cachedWeather) {
      return cachedWeather;
    }

    const apiWeatherForecastData =
      await this.thirdPartyApiService.getCityForecast(city);

    await this.cacheManager.set(cacheKey, apiWeatherForecastData, 600000);

    return apiWeatherForecastData;
  }
}
