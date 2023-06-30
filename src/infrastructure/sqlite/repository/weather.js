import Weather from '../../../domain/Weather/entity';
import WeatherRepositoryInterface from '../../../domain/Weather/repository';

/**
 * WeatherRepository class responsible for interacting with Weather data in a database.
 * @extends WeatherRepositoryInterface
 */
export default class WeatherRepository extends WeatherRepositoryInterface {
  /**
   * Create a new WeatherRepository instance.
   * @param {SQLClient} SQLClient - The SQL client object used for database operations.
   */
  constructor(SQLClient) {
    super();
    this.client = SQLClient;
  }

  /**
   * Update the weather data in the database.
   * @param {Weather} weather - The Weather object containing the updated data.
   * @returns {Weather} - The updated Weather object.
   */
  async update(weather) {
    try {
      const current_weather = await this.findFirst();
      const currentTimeStamp = new Date().toISOString();
      if (current_weather != null) {
        const query = `UPDATE weather SET temperature = ${weather.temperature}, humidity = ${weather.humidity}, last_update = "${currentTimeStamp}" WHERE 1`;
        await this.client.run(query);
      } else {
        const insertQuery = `INSERT INTO weather (temperature, humidity, last_update) VALUES (${weather.temperature}, ${weather.humidity}, "${currentTimeStamp}")`;
        await this.client.run(insertQuery);
      }
      return new Weather(weather.temperature, weather.humidity);
    } catch (err) {
      return null;
    }
  }

  /**
   * Find the first weather data entry in the database.
   * @returns {Weather} - The first Weather object found.
   */
  async findFirst() {
    const query = 'SELECT * FROM weather ORDER BY last_update LIMIT 1;';
    const result = await new Promise((resolve, reject) => {
      this.client.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    if (result.length > 0) {
      const data = result[0];
      const weather = new Weather(data.temperature, data.humidity);
      return weather;
    } else {
      return null;
    }
  }
}
