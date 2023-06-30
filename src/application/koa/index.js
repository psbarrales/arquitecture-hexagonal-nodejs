import Koa from 'koa';
import koaBody from 'koa-body';
import cors from '@koa/cors';
import Routes from './routes';
import AppAdapter from '../adapter';

/**
 * KoaAdapter class responsible for adapting the application to use Koa framework.
 * @extends AppAdapter
 */
export default class KoaAdapter extends AppAdapter {
  /**
   * Create a new KoaAdapter instance.
   * @param {Domain} domain - The Domain object containing the application domain logic.
   */
  constructor(domain) {
    super();
    this.app = new Koa();
    this.app.use(koaBody());
    this.app.use(cors());

    this.routes = new Routes(this.app, domain);
  }

  /**
   * Start listening to the specified port.
   * @param {number} port - The port number to listen on.
   * @param {function} cb - The callback function to execute when listening starts.
   */
  listen(port, cb) {
    this.app.listen(port, cb);
  }
}
