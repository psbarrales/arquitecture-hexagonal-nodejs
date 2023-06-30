import Router from '@koa/router';
// eslint-disable-next-line no-unused-vars
import WeatherUseCase from '../../../domain/Weather/usecase';
import Weather from '../../../domain/Weather/entity';

export default class WeatherRouter {
  /**
   *
   * @param {WeatherUseCase} weatherUseCase
   * @returns
   */
  router = new Router({
    prefix: '/weather',
  });
  constructor(weatherUseCase) {
    this.router.get(
      '/',
      async (ctx) => await this.getCurrentWeather(ctx, weatherUseCase)
    );

    this.router.post(
      '/',
      async (ctx) => await this.updateWeather(ctx, weatherUseCase)
    );
  }

  /**
   *
   * @param {*} ctx
   * @param {WeatherUseCase} weatherUseCase
   */
  async getCurrentWeather(ctx, weatherUseCase) {
    try {
      const currentWeather = await weatherUseCase.current();
      ctx.body = {
        temperature: currentWeather.temperature,
        humidity: currentWeather.humidity,
      };
      return ctx.body;
    } catch (err) {
      ctx.throw(err);
    }
  }

  /**
   *
   * @param {*} ctx
   * @param {WeatherUseCase} weatherUseCase
   */
  async updateWeather(ctx, weatherUseCase) {
    try {
      const weather = new Weather(
        parseFloat(ctx.request.body.temperature),
        parseFloat(ctx.request.body.humidity)
      );
      const currentWeather = await weatherUseCase.update(weather);
      ctx.body = {
        temperature: currentWeather.temperature,
        humidity: currentWeather.humidity,
      };
      return ctx.body;
    } catch (err) {
      ctx.throw(err);
    }
  }
}
