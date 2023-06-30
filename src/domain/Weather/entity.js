/**
 * Representa las condiciones climáticas.
 * @class
 * @default
 */
export default class Weather {
  /**
   * La temperatura en grados Celsius.
   * @type {number}
   */
  temperature = 0;

  /**
   * El nivel de humedad como un porcentaje.
   * @type {number}
   */
  humidity = 0;

  /**
   * Crea una nueva instancia de la clase Weather.
   * @constructor
   * @param {number} temperature - La temperatura en grados Celsius.
   * @param {number} humidity - El nivel de humedad como un porcentaje.
   */
  constructor(temperature, humidity) {
    this.temperature = temperature;
    this.humidity = humidity;
  }
}
