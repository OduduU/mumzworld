import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { mockDeep } from 'jest-mock-extended';
import { WeatherService } from './weather.service';
import { ThirdPartyService } from '../third-party/third-party.service';

const mockCache = mockDeep<Cache>();
const mockThirdPartyService = mockDeep<ThirdPartyService>();

describe('WeatherService', () => {
  let service: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        { provide: CACHE_MANAGER, useValue: mockCache },
        { provide: ThirdPartyService, useValue: mockThirdPartyService },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCityWeather', () => {
    it('should return cached weather data', async () => {
      mockCache.get.mockResolvedValue({
        location: {
          name: 'Lagos',
          region: 'Lagos',
          country: 'Nigeria',
          lat: 6.4531,
          lon: 3.3958,
          tz_id: 'Africa/Lagos',
        },
        current: {
          temp_c: 25.1,
          temp_f: 77.2,
          is_day: 0,
        },
      });

      const result = await service.getCityWeather('lagos');

      expect(result).toEqual({
        location: {
          name: 'Lagos',
          region: 'Lagos',
          country: 'Nigeria',
          lat: 6.4531,
          lon: 3.3958,
          tz_id: 'Africa/Lagos',
        },
        current: {
          temp_c: 25.1,
          temp_f: 77.2,
          is_day: 0,
        },
      });
      expect(mockThirdPartyService.getCityWeather).not.toHaveBeenCalled();
      expect(mockCache.set).not.toHaveBeenCalled();
    });

    it("should fetch a given city's weather info", async () => {
      mockCache.get.mockResolvedValue(null);
      mockThirdPartyService.getCityWeather.mockResolvedValue({
        location: {
          name: 'Lagos',
          region: 'Lagos',
          country: 'Nigeria',
          lat: 6.4531,
          lon: 3.3958,
          tz_id: 'Africa/Lagos',
        },
        current: {
          temp_c: 25.1,
          temp_f: 77.2,
          is_day: 0,
        },
      });

      await service.getCityWeather('lagos');

      expect(mockThirdPartyService.getCityWeather).toHaveBeenCalledWith(
        'lagos',
      );
      expect(mockCache.set).toHaveBeenCalledWith(
        'lagos_weather',
        {
          location: {
            name: 'Lagos',
            region: 'Lagos',
            country: 'Nigeria',
            lat: 6.4531,
            lon: 3.3958,
            tz_id: 'Africa/Lagos',
          },
          current: {
            temp_c: 25.1,
            temp_f: 77.2,
            is_day: 0,
          },
        },
        600000,
      );
    });
  });
});
