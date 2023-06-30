import * as dotenv from 'dotenv';
import KoaAdapter from './application/koa';
import Domain from './domain';
import SQLiteAdapter from './infrastructure/sqlite';

dotenv.config({
  path: process.cwd() + '/.env',
});

function main() {
  const sqliteAdapter = new SQLiteAdapter();
  const domain = new Domain(sqliteAdapter);
  const koaAdapter = new KoaAdapter(domain);
  // Listening...
  const port = process.env.API_PORT || 3000;
  koaAdapter.listen(port, () => {
    console.debug('API started on port: ' + port);
  });
}

main();
