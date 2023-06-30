import WeatherUseCase from './Weather/usecase';

export default class Domain {
  constructor(persistenceAdapter) {
    this.port = {
      WeatherUseCase: new WeatherUseCase(persistenceAdapter.WeatherRepository),
    };
  }
}
