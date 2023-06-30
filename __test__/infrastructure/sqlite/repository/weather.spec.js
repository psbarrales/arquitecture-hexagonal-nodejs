import Weather from '../../../../src/domain/Weather/entity';
import WeatherRepository from '../../../../src/infrastructure/sqlite/repository/weather';

describe('WeatherRepository', () => {
  let weatherRepository;
  let mockClient;

  beforeEach(() => {
    mockClient = {
      run: jest.fn(() => [new Weather(10, 30)]),
      all: jest.fn((q, cb) => cb(null, [new Weather(10, 30)])),
    };
    weatherRepository = new WeatherRepository(mockClient);
  });

  describe('update', () => {
    it('should call this.client.run with format SQL Query', async () => {
      const mockWeather = new Weather(25, 60);
      await weatherRepository.update(mockWeather);
      expect(mockClient.run.mock.calls).toHaveLength(1);
    });
  });

  describe('findFirst', () => {
    it('should call this.client.run with format SQL Query', async () => {
      await weatherRepository.findFirst();
      expect(mockClient.all.mock.calls).toHaveLength(1);
    });
  });
});
