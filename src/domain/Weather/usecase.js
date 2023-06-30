import Weather from './entity';
import WeatherRepository from './repository';

export default class WeatherUseCase {
  /**
   * @constructor
   * @param {WeatherRepository} repository
   */
  constructor(repository) {
    if (repository === null) throw new Error('"repository" is null');
    this.repository = repository;
  }

  /**
   * Puerto: update
   * @param {Weather} weather
   * @returns {Promise<Weather>}
   */
  async update(weather) {
    return await this.repository.update(weather);
  }

  /**
   * Puerto: current
   * @returns {Promise<Weather>}
   */
  async current() {
    const weather = await this.repository.findFirst();
    if (weather == null) return this.update(new Weather(20, 50));
    return weather;
  }
}
