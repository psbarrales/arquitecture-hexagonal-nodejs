import Router from '@koa/router';
import WeatherRouter from './weather';
import Domain from '../../../domain';

/**
 * Clase para definir las rutas y los middlewares correspondientes que se utilizarán con la biblioteca Koa.
 */
export default class Routes {
  /**
   * Crea una instancia de Routes.
   * @param {KoaApp} koaApp - Instancia de la aplicación Koa.
   * @param {Domain} domain - El objeto domain que contiene los casos de uso necesarios para manejar las rutas en una implementación de arquitectura hexagonal.
   */
  constructor(koaApp, domain) {
    const router = new Router();

    // Crea una nueva instancia de WeatherRouter y configúrala para manejar las rutas relacionadas con el clima.
    const weatherRoutes = new WeatherRouter(domain.port.WeatherUseCase);
    router.use(
      weatherRoutes.router.routes(),
      weatherRoutes.router.allowedMethods()
    );

    // Configura la aplicación Koa para utilizar el enrutador.
    koaApp.use(router.routes()).use(router.allowedMethods());
  }
}
