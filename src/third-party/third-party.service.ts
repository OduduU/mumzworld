import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ThirdPartyService {
  private baseUrl = 'https://api.weatherapi.com/v1';
  private apiKey = process.env.WEATHER_APIKEY;

  constructor(private readonly httpService: HttpService) {}

  async getCityWeather(city: string): Promise<any> {
    const url = `${this.baseUrl}/current.json?q=${city}&key=${this.apiKey}`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      throw new Error(`API Request Failed: ${error.message}`);
    }
  }

  async getCityForecast(city: string): Promise<any> {
    const url = `${this.baseUrl}/forecast.json?q=${city}&key=${this.apiKey}&days=5`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      throw new Error(`API Request Failed: ${error.message}`);
    }
  }
}
