import sqlite3 from 'sqlite3';
import PersistenceAdapter from '../adapter';
import WeatherRepository from './repository/weather';

const SQLITE_DB_FILE = 'db.sqlite';

export default class SQLiteDBAdapter extends PersistenceAdapter {
  constructor() {
    super();
    this.client = this.connect();
    this.setup();
    this.WeatherRepository = new WeatherRepository(this.client);
  }

  connect() {
    return new sqlite3.Database(SQLITE_DB_FILE);
  }

  setup() {
    this.client.run(
      `CREATE TABLE IF NOT EXISTS 
        weather(
            temperature REAL, 
            humidity REAL,
            last_update TEXT
        )`
    );
  }
}
