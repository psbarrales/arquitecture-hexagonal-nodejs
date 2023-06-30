import Router from '@koa/router';
import WeatherRouter from '../../../src/application/koa/routes/weather';
import Weather from '../../../src/domain/Weather/entity';

describe('WeatherRouter', () => {
  let router;
  let ctx;

  beforeEach(() => {
    router = new Router();
    ctx = {
      throw: jest.fn(),
      body: null,
    };
  });

  describe('getCurrentWeather', () => {
    it('should set current weather data in the response body', async () => {
      // Mock current weather data
      const currentWeather = {
        temperature: 25,
        humidity: 50,
      };

      // Mock WeatherUseCase.current method
      const weatherUseCase = {
        current: jest.fn(
          () => new Weather(currentWeather.temperature, currentWeather.humidity)
        ),
      };

      // Create instance of WeatherRouter
      const weatherRouter = new WeatherRouter(weatherUseCase);
      // Call getCurrentWeather method
      await weatherRouter.getCurrentWeather(ctx, weatherUseCase);

      // Check response body
      expect(ctx.body).toEqual({
        temperature: currentWeather.temperature,
        humidity: currentWeather.humidity,
      });
    });
  });

  describe('updateWeather', () => {
    it('should call update usecase and set the new data in the response body', async () => {
      // Mock current weather data
      const currentWeather = {
        temperature: 25,
        humidity: 50,
      };
      // Mock WeatherUseCase.current method
      const weatherUseCase = {
        update: jest.fn((weather) => weather),
      };

      // Add ctx.request
      ctx.request = { body: currentWeather };
      // Create instance of WeatherRouter
      const weatherRouter = new WeatherRouter(weatherUseCase);
      // Call getCurrentWeather method
      await weatherRouter.updateWeather(ctx, weatherUseCase);
      // Check response body
      expect(ctx.body).toEqual({
        temperature: currentWeather.temperature,
        humidity: currentWeather.humidity,
      });
    });
  });
});
