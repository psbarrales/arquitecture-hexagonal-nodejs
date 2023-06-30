// Importaciones de módulos y clases necesarios para las pruebas
import WeatherUseCase from '../../../src/domain/Weather/usecase';
import WeatherRepository from '../../../src/domain/Weather/repository';
import Weather from '../../../src/domain/Weather/entity';

// Descripción de las pruebas
describe('Weather Use Case', () => {
  let repository = null;

  beforeEach(() => {
    // Mock del Repositorio
    let weather = new Weather(
      20.1, // temperatura
      54.2 // humedad
    );
    repository = new WeatherRepository();
    repository.findFirst = jest.fn(() => weather);
    repository.update = jest.fn((newWeather) => {
      weather = newWeather;
      return weather;
    });
  });

  // Prueba para verificar si se obtiene el clima actual correctamente
  it('should return current weather', async () => {
    const usecase = new WeatherUseCase(repository);
    const weather = await usecase.current();
    expect(weather).toBeDefined();
    // Verificación de si se llama al repositorio de prueba
    expect(repository.findFirst.mock.calls).toHaveLength(1);
  });

  // Prueba para verificar si se obtiene el nuevo clima actualizado correctamente
  it('should return the new current weather updated', async () => {
    const usecase = new WeatherUseCase(repository);
    let weather = new Weather(12, 75);
    weather = await usecase.update(weather);
    // Verificación de si se llama al repositorio de prueba
    expect(repository.update.mock.calls).toHaveLength(1);
    // Verificación del comportamiento esperado
    expect(weather.temperature).toBe(12);
    expect(weather.humidity).toBe(75);
  });
});
