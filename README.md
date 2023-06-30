# Arquitectura Hexagonal: Implementada en NodeJS

Hace unos días publiqué un articulo sobre los conceptos básico de la arquitectura hexagonal [https://medium.com/@psbarrales/introducción-a-la-arquitectura-hexagonal-conceptos-básicos-y-cómo-utilizarla-2e3896a8a6b8](https://medium.com/@psbarrales/introducci%C3%B3n-a-la-arquitectura-hexagonal-conceptos-b%C3%A1sicos-y-c%C3%B3mo-utilizarla-2e3896a8a6b8), ya!, está bien, no fue hace unos días, sino hace meses. Sin embargo, ahora es el momento de llevar a cabo la implementación utilizando NodeJS.

## Resumen rápido

Esta arquitectura se compone de tres partes principales:

1. **Núcleo de dominio (o capa de dominio)**: Es el corazón de la arquitectura hexagonal y contiene la lógica de negocio y reglas del dominio específico de la aplicación. Aquí se definen los conceptos, entidades y operaciones clave que representan el problema que se está resolviendo. Esta capa no depende de ninguna otra capa y no tiene conocimiento de detalles técnicos o infraestructura externa.
2. **Adaptadores**: Los adaptadores se encargan de conectar el núcleo de dominio con el mundo exterior. Hay dos tipos de adaptadores:
    
    a. Adaptadores de entrada (también conocidos como puertos de entrada): Estos adaptadores reciben las solicitudes externas y las convierten en llamadas al núcleo de dominio. Pueden ser interfaces de usuario, API REST, eventos, mensajes, entre otros. Su función principal es traducir y validar los datos de entrada, y luego invocar los casos de uso apropiados en el núcleo de dominio.
    
    b. Adaptadores de salida (o puertos de salida): Estos adaptadores se encargan de enviar las respuestas generadas por el núcleo de dominio hacia el exterior. Pueden ser bases de datos, servicios externos, sistemas de archivos, entre otros. Su función principal es traducir los datos del núcleo de dominio a un formato adecuado para el medio de salida correspondiente.
    
3. **Infraestructura**: Esta capa contiene los componentes técnicos necesarios para que los adaptadores funcionen correctamente. Incluye frameworks, bibliotecas, bases de datos, servicios externos, sistemas de archivos, etc. El objetivo de esta capa es proporcionar las herramientas y la infraestructura necesarias para que los adaptadores se comuniquen con el exterior y el núcleo de dominio.

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/634e1700-ebc7-4447-841a-53c578034af4/Untitled.png)

## Problema

En un post anterior (guiño), planteé un problema y ahora me dispongo a abordarlo utilizando la arquitectura hexagonal. El problema planteado fue el siguiente:

> *Una empresa agricultora necesita controlar sus sistemas de riego, clima y dispositivos de su nuevo gran invernadero automatizado. Para ello, requiere conocer con precisión la temperatura y humedad actual del lugar, encender el sistema de riego en ciertos intervalos y ventilar o calentar el invernadero dependiendo de cómo se mueve el clima.*
> 

La agricultura es crucial para la humanidad y enfrentamos un desafío si no resolvemos este problema. A lo largo de la historia, ha sido fundamental para el desarrollo de sociedades y civilizaciones. Hoy en día, es esencial para alimentar a la población y garantizar la seguridad alimentaria. Buscar soluciones innovadoras y sostenibles es vital.

Dada la complejidad del problema tratar de resolverlo todo en un post parece que es mucho, así que dividiré la solución y la atacaré en 3 etapas.

## Plan de Implementación

### Tecnologías y Frameworks

**NodeJS**: Por su puesto, esencial tener nuestro motor, usaremos la versión de **ECMAScript 2015** para **ayudarnos con el uso de Clases** y el heredado de estas. Para asegurarnos de que nuestro código mantenga su estructura a través de diferentes versiones de Node.js, usaremos **Babel como transpilador.**

**KoaJS**: Mi framework web favorito se destaca por su simplicidad, construiremos una API para manejar nuestro invernadero.

**Base de datos**: SQLlite, mantener la información relacionada al clima actual y dispositivos.

**Cola de eventos**: Redis, usaremos su feature ****Redis Pub/Sub**** para enviar y recibir eventos de los sensores.

### Estructura de carpetas

Mantendremos el código dentro una carpeta `/src` y si bien no hay un estándar para estructurar la arquitectura nosotros usaremos análogamente los elementos de la arquitectura:
`domain/`: Este será el corazón, pondremos acá toda l**a lógica de negocio**, acá expondremos **puertos de entrada y salida**.

`application/`: Acá pondremos **adaptadores de entrada** que usará los puertos del dominio.

`framework/`: Y esta carpeta tendrá los **adaptadores de salida** que usará los puertos del dominio.

### Creación de proyecto

Usaremos nuestra carpeta favorita y arrancaremos con `npm init -y` e instalaremos los paquetes fundamentales:

```bash
npm i @babel/core @babel/preset-env @babel/register babel-polyfill dotenv -S &&
npm i koa koa-body @koa/cors @koa/router -S && 
npm i nodemon -D
```

Cambiaremos un poco nuestro `package.json`, agregamos el script para mantener a **nodemon** escuchando nuestros cambios y agregaremos lineas de arranque con Babel:

```json
..
"main": "src/index.js",
...
"scripts": {
	"start": "nodemon --require @babel/register --require babel-polyfill --require dotenv/config --watch ./src",
}
..
```

Crearemos también un `.babelrc` con este contenido:

```json
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "node": "current"
                }
            }
        ]
    ]
}
```

Bien todo parece estar listos, creemos un archivo `index.js` con un contenido muy sencillo:

```jsx
function main() {
  console.log('Projecto preparado!');
}

main();
```

Y corremos en nuestro terminal `npm run start`:

```bash
$ **npm run start**

> hexagonal@1.0.0 start
> nodemon --require @babel/register --require babel-polyfill --require dotenv/config --watch ./src/

[nodemon] 2.0.22
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node --require @babel/register --require babel-polyfill --require dotenv/config src/index.js`
Projecto preparado!
[nodemon] clean exit - waiting for changes before restart
```

## Controlar el Clima

Para nuestro problema, el clima parece ser un valor a guardar y mantener. Para lograrlo, es necesario crear y actualizar estos valores.

## Dominio

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0e96c260-57d4-4163-bf00-fc6ada537613/Untitled.png)

### Entidad

En la carpeta `domain/`, se creará una subcarpeta llamada `Weather` (se utilizará el inglés para el código). Dentro de **`Weather`**, se creará el archivo `entity.js` que contendrá la implementación equivalente a las **Entidades en el Domain Driven Design**.

Dentro de este archivo, se define la clase `Weather`, que representa las condiciones climáticas. La clase tendrá propiedades **`humidity`** (humedad) y `temperature` (temperatura). Aunque, estrictamente hablando en el **DDD**, esto sería un **Object Value** y debería tener un identificador único para ser considerado una **Entidad**, se tomarán ciertas libertades en relación al **Domain Driven Design** con el objetivo de mantener el código simple. La implementación de la clase `Weather` en el archivo `entity.js` será la siguiente:

```jsx
/**
 * Represents the weather conditions.
 * @class
 * @default
 */
export default class Weather {
  /**
   * The temperature in degrees Celsius.
   * @type {number}
   */
  temperature = 0;

  /**
   * The humidity level as a percentage.
   * @type {number}
   */
  humidity = 0;

  /**
   * Create a new instance of the Weather class.
   * @constructor
   * @param {number} temperature - The temperature in degrees Celsius.
   * @param {number} humidity - The humidity level as a percentage.
   */
  constructor(temperature, humidity) {
    this.temperature = temperature;
    this.humidity = humidity;
  }
}
```

En JavaScript, tenemos la libertad de no tener que crear setters/getters para las propiedades de la clase.

### Caso de Uso

En la carpeta `Weather`, agregaremos un archivo llamado `usecase.js`. Este archivo contendrá los casos de uso, servicios y cualquier otra cosa que consideremos conveniente para nuestro proyecto.

A continuación, se muestra la implementación del archivo `usecase.js`:

```jsx
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

```

En este código, se definen dos casos de uso que actuarán como nuestros **puertos de entrada**:

- `update`: Este caso de uso se utiliza para actualizar la temperatura y la humedad.
- `current`: Este caso de uso se utiliza para obtener la temperatura y la humedad actuales. Si no hay datos en la base de datos, se creará un objeto de clima por defecto.

Observarás que hay una línea que dice `import WeatherRepository from './repository';`. El repositorio es una dependencia del dominio, lo que significa que no funcionaría si no tenemos los **adaptadores de los puertos de salida** conectados correctamente.

### Repositorio

El Repositorio es una **clase de interfaz** para el Dominio, donde definimos los métodos que debe tener un **adaptador de salida**. Aunque JavaScript no tiene soporte nativo para interfaces, en TypeScript sí podemos utilizarlas. Por lo tanto, crearemos una clase con una buena documentación y la llamaremos `repository.js`, la cual estará ubicada en la carpeta `Weather`.

A continuación se muestra la implementación de la interfaz `WeatherRepositoryInterface`:

```jsx
/**
 * @interface
 * @exports Repository
 * Interface for the Repository, following the Hexagonal Architecture pattern.
 * This interface defines the methods that a repository should implement.
 */
export default class WeatherRepositoryInterface {
  /**
   * A method to update the data stored in the repository.
   * This method should return a Promise that resolves to the same updated data.
   * @abstract
   * @param {Weather} weather - The weather object to update.
   * @returns {Promise<Weather>} A Promise that resolves to the updated data in the repository.
   * @throws {Error} If there's an error accessing the repository.
   */
  async update(weather) {
    throw new Error(
      'WeatherRepositoryInterface "update" method not implemented!'
    );
  }

  /**
   * A method to retrieve the first weather object stored in the repository.
   * This method should return a Promise that resolves to a {Weather} object.
   * @abstract
   * @returns {Promise<Weather>} A Promise that resolves to the first weather object in the repository.
   * @throws {Error} If there's an error accessing the repository.
   */
  async findFirst() {
    throw new Error(
      'WeatherRepositoryInterface "findFirst" method not implemented!'
    );
  }
}

```

Una ventaja de no utilizar interfaces en JavaScript es que podemos crear un `WeatherRepositoryInterface` con su implementación, lo cual es útil para realizar pruebas de manera más sencilla.

### Testing

Utilizando la arquitectura hexagonal, puedes escribir pruebas unitarias a la lógica de negocio utilizando adaptadores simulados que imitan el comportamiento de los adaptadores reales. Esto te permite **probar el comportamiento de la lógica del dominio** de manera consistente, independientemente de los adaptadores con los que esté conectada.

Usaremos Jest https://jestjs.io/, para instalarlo `npm run i jest -D`

Agregamos en nuestro `package.json` el script para el uso de `jest` :

```json
...
"scripts": {
	  ...
    "test": "jest --passWithNoTests"
  },
```

Al correr `npm run test` deberíamos ver algo así

```bash
npm run test

> hexagonal@1.0.0 test
> jest --passWithNoTests

No tests found, exiting with code 0
```

Dos test sencillos pero poderosos, validar que los **casos de uso** utilice correctamente el **repositorio** proporcionado.

Crearemos un archivo que contenga nuestro suite de pruebas `__test__/domain/Weather/usecase.spec.js`

```jsx
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
```

No entraré en detalle, pero en ambos test se prueba que al proporcionar un **repositorio mock**, este será utilizado y se comportará como se espera.

Al correr `npm run test` nuevamente veremos:

```bash
npm run test

> hexagonal@1.0.0 test
> jest --passWithNoTests

 PASS  __test__/domain/Weather/usecase.spec.js
  Weather Use Case
    ✓ should return current weather (1 ms)
    ✓ should return the new current weather updated (1 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.664 s, estimated 1 s
Ran all test suites.
```

### Exponer los casos de uso

Hemos finalizado la definición del **dominio** y ahora necesitamos exponerlo como **puertos** para que una **aplicación** pueda utilizarlo.

En la carpeta `/src/domain`, crearemos un archivo `index.js` que nos permitirá exportar el **dominio** y sus casos de uso:

```jsx
import WeatherUseCase from './Weather/usecase';

export default class Domain {
  constructor(persistenceAdapter) {
    this.port = {
      WeatherUseCase: new WeatherUseCase(persistenceAdapter.WeatherRepository),
    };
  }
}

```

Al iniciar el **dominio**, se requiere el **adaptador de salida** y también se debe tener la implementación de la interfaz `WeatherRepository`, la cual es requerida por `WeatherUseCase`. En este punto, podríamos utilizar la librería **Joi** para validar el esquema del adaptador, pero por ahora, dejaremos las cosas de esta manera.

## Infraestructura

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4472a7c6-ec2c-4dee-974d-129dc7f158d3/Untitled.png)

### Adaptadores de salida

Para asegurar la claridad del código, crearemos una clase base vacía de la cual todos los **adaptadores de salida** extenderán. Esta clase base se ubicará en la ruta `./infrastructure/adapter.js` y se llamará `PersistenceAdapter`:

```jsx
export default class PersistenceAdapter {}
```

Y crearemos nuestro primer **adaptador de salida** del **dominio**.

### SQLite Adapter

Para utilizar el adaptador SQLite, primero debemos instalar la librería `sqlite3` ejecutando el siguiente comando: `npm i sqlite3 -S`.

En el archivo `./infrastructure/sqlite/index.js`, la clase `SQLiteDBAdapter` debe implementar los **repositorios** que actuarán como los **puertos de salida** definidos para que el **dominio** pueda utilizarlos:

```jsx
import sqlite3 from 'sqlite3';
import PersistenceAdapter from '../adapter';
import WheatherRepository from './repository/weather';

const SQLITE_DB_FILE = 'db.sqlite';

export default class SQLiteDBAdapter extends PersistenceAdapter {
  constructor() {
    super();
    this.client = this.connect();
    this.setup();
    this.WheatherRepository = new WheatherRepository(this.client);
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
```

En este código, utilizamos el método `connect` y luego `setup` para establecer la conexión con la base de datos y configurarla adecuadamente. Luego, creamos el **repositorio** `WeatherRepository` para el acceso a los datos relacionados con el clima.

Espero que se entienda el código. El adaptador SQLite se encarga de la conexión a la base de datos, la configuración inicial y la creación del repositorio necesario para interactuar con los datos del clima.

Hemos importado `import WheatherRepository from './repository/weather';` que será la implementación de `WeatherRepositoryInterface`  con **SQLite** y con todos los métodos requeridos quedaría así:

```
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
```

En este código, el repositorio `WeatherRepository` implementa la interfaz `WeatherRepositoryInterface`, estableciendo así la conexión entre la capa de dominio y la capa de persistencia. El repositorio utiliza un cliente SQL (`SQLClient`) para realizar las operaciones en la base de datos SQLite.

El método `update` actualiza los datos del clima en la base de datos. Verifica si ya existe un registro de clima en la base de datos y, en función de eso, ejecuta una consulta de actualización o inserción. Luego, devuelve un objeto `Weather` con los datos actualizados.

El método `findFirst` recupera el primer registro de datos de clima de la base de datos. Realiza una consulta SQL para seleccionar el primer registro ordenado por la columna "last_update". Si se encuentra un registro, crea un objeto `Weather` con los datos y lo devuelve. Si no se encuentra ningún registro, devuelve **`null`**.

Este diseño cumple con la arquitectura hexagonal, ya que la capa de persistencia depende del dominio, lo que permite la separación de preocupaciones y la modularidad del sistema.

### Testing

Por último el test de la implementación del **repositorio**, en la ruta `/__test__/infrastructure/sqlite/repository/weather.spec.js`

```jsx
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
```

Probamos unitariamente que al llamar a los métodos del **repositorio** `update` ****y `findFirst` usan el cliente `sqlite3`.

## Aplicación

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f372eafe-0b1d-48d8-99dd-dd8632d90c23/Untitled.png)

Espero me hayas seguido hasta acá, ya tenemos nuestros **dominio** y tenemos un **adaptor de persistencia** creada, ahora falta usar los **puertos de entrada**, entonces los usaremos mediante una **API REST** creada con **Koa.JS**

### Adaptadores de entrada

Crearemos una clase base vacía para todos los **adaptadores de entrada**, al igual que en la capa de **infraestructura**. En la ruta `./application/adapter.js`, crearemos el archivo:

```jsx
export default class AppAdapter {
  listen() {}
}
```

En este caso, la clase `AppAdapter` actuará como una plantilla base para los **adaptadores de entrada** en nuestra aplicación. La función `listen()` estará disponible para ser implementada por los adaptadores específicos, y será responsable de escuchar las solicitudes de entrada y manejarlas según sea necesario.

### ****Adaptador KoaJS****

En la ruta `./application/koa/index.js`, vamos a implementar la clase `KoaAdapter`, que heredará de `AppAdapter` y será responsable de configurar y ejecutar la aplicación Koa:

```jsx
import Koa from 'koa'
import koaBody from 'koa-body'
import cors from '@koa/cors'
import Routes from './routes'
import AppAdapter from '../adapter'

export default class KoaAdapter extends AppAdapter {
  constructor(domain) {
    super()
    this.app = new Koa()
    this.app.use(koaBody())
    this.app.use(cors())

    this.routes = new Routes(this.app, domain)
  }

  listen(port, cb) {
    this.app.listen(port, cb)
  }
}
```

También vamos a centralizar las rutas, de modo que asignaremos los `path` a los **puertos de entrada** en el archivo `./routes/index.js`:

```jsx
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

    // Crea una nueva instancia de WeatherRouter y configura las rutas relacionadas con el clima.
    const weatherRoutes = new WeatherRouter(domain.port.WeatherUseCase);
    router.use(
      weatherRoutes.router.routes(),
      weatherRoutes.router.allowedMethods()
    );

    // Configura la aplicación Koa para utilizar el enrutador.
    koaApp.use(router.routes()).use(router.allowedMethods());
  }
}
```

Los endpoints para `weather` quedarían de la siguiente manera, donde se hace uso de los **casos de uso** según el método utilizado:

```jsx
import Router from '@koa/router';
// eslint-disable-next-line no-unused-vars
import WeatherUseCase from '../../../domain/Weather/usecase';
import Weather from '../../../domain/Weather/entity';

export default class WeatherRouter {
  /**
   *
   * @param {WeatherUseCase} weatherUseCase
   * @returns
   */
  router = new Router({
    prefix: '/weather',
  });
  constructor(weatherUseCase) {
    this.router.get(
      '/',
      async (ctx) => await this.getCurrentWeather(ctx, weatherUseCase)
    );

    this.router.post(
      '/',
      async (ctx) => await this.updateWeather(ctx, weatherUseCase)
    );
  }

  /**
   *
   * @param {*} ctx
   * @param {WeatherUseCase} weatherUseCase
   */
  async getCurrentWeather(ctx, weatherUseCase) {
    try {
      const currentWeather = await weatherUseCase.current();
      ctx.body = {
        temperature: currentWeather.temperature,
        humidity: currentWeather.humidity,
      };
      return ctx.body;
    } catch (err) {
      ctx.throw(err);
    }
  }

  /**
   *
   * @param {*} ctx
   * @param {WeatherUseCase} weatherUseCase
   */
  async updateWeather(ctx, weatherUseCase) {
    try {
      const weather = new Weather(
        parseFloat(ctx.request.body.temperature),
        parseFloat(ctx.request.body.humidity)
      );
      const currentWeather = await weatherUseCase.update(weather);
      ctx.body = {
        temperature: currentWeather.temperature,
        humidity: currentWeather.humidity,
      };
      return ctx.body;
    } catch (err) {
      ctx.throw(err);
    }
  }
}
```

Se define la clase `WeatherRouter` que establece los endpoints relacionados con el clima. Los métodos `getCurrentWeather` y `updateWeather` son responsables de manejar las solicitudes GET y POST respectivamente. Estos métodos utilizan los **casos de uso** (`weatherUseCase`) para interactuar con el **dominio** y realizar las operaciones correspondientes.

En el método `getCurrentWeather`, se obtiene el clima actual a través del **caso de uso** y se envía la respuesta con la temperatura y la humedad al `body` de la respuesta. En el método `updateWeather`, se crea una instancia de la entidad `Weather` utilizando los datos proporcionados en la solicitud y se utiliza el **caso de uso** para actualizar el clima. A continuación, se envía la respuesta con el clima actualizado al `body`.

Con esta implementación, los endpoints para `weather` están configurados correctamente y hacen uso de los **casos de uso** correspondientes según el método utilizado.

### Testing

El archivo de pruebas sería el siguiente:

```jsx
import Router from '@koa/router';
import WeatherRouter from '../../../src/application/koa/routes/weather';
import Weather from '../../../src/domain/Weather/entity';

describe('WeatherRouter', () => {
  let router;
  let ctx;

  beforeEach(() => {
    router = new Router();
    ctx = {
      throw: jest.fn(),
      body: null,
    };
  });

  describe('getCurrentWeather', () => {
    it('should set current weather data in the response body', async () => {
      // Mock current weather data
      const currentWeather = {
        temperature: 25,
        humidity: 50,
      };

      // Mock WeatherUseCase.current method
      const weatherUseCase = {
        current: jest.fn(
          () => new Weather(currentWeather.temperature, currentWeather.humidity)
        ),
      };

      // Create instance of WeatherRouter
      const weatherRouter = new WeatherRouter(weatherUseCase);
      // Call getCurrentWeather method
      await weatherRouter.getCurrentWeather(ctx, weatherUseCase);

      // Check response body
      expect(ctx.body).toEqual({
        temperature: currentWeather.temperature,
        humidity: currentWeather.humidity,
      });
    });
  });

  describe('updateWeather', () => {
    it('should call update usecase and set the new data in the response body', async () => {
      // Mock current weather data
      const currentWeather = {
        temperature: 25,
        humidity: 50,
      };
      // Mock WeatherUseCase.current method
      const weatherUseCase = {
        update: jest.fn((weather) => weather),
      };

      // Add ctx.request
      ctx.request = { body: currentWeather };
      // Create instance of WeatherRouter
      const weatherRouter = new WeatherRouter(weatherUseCase);
      // Call getCurrentWeather method
      await weatherRouter.updateWeather(ctx, weatherUseCase);
      // Check response body
      expect(ctx.body).toEqual({
        temperature: currentWeather.temperature,
        humidity: currentWeather.humidity,
      });
    });
  });
});
```

En estas pruebas, hemos utilizado **mocks** de los **casos de uso** para asegurarnos de que se utilice el valor obtenido del **dominio**.

## Todo Junto

Hemos implementado tres capas de la **arquitectura hexagonal**: una capa de **dominio** y dos capas de **adaptadores**, tanto de **entrada** como de **salida**.

En resumen, tenemos un **dominio** que necesita un **adaptador de salida**, y a su vez, tenemos un **adaptador de entrada** que requiere un **dominio**.

```
Adaptador entrada ← Dominio ← Adaptador salida
```

Para ponerlo todo junto, debemos iniciar todo en el archivo `src/index.js`:

```jsx
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
```

En la función `main`, primero creamos el **adaptador de salida** `SQLiteAdapter`, luego iniciamos el **dominio** pasando nuestro `sqliteAdapter`, y después iniciamos el **adaptador de entrada** `KoaAdapter` y le pasamos el `domain` como parámetro. Por último, utilizamos el método `listen` del **adaptador de salida**.

Si ejecutamos `npm run start`:

```bash
npm run start

> hexagonal@1.0.0 start
> nodemon --require @babel/register --require babel-polyfill --require dotenv/config --watch ./src

[nodemon] 2.0.22
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node --require @babel/register --require babel-polyfill --require dotenv/config src/index.js`
API started on port: 3000
```

Ahora puedes probar haciendo una petición a http://localhost:3000/weather y verás la siguiente respuesta:

```bash
curl -X GET http://localhost:3000/weather
{"temperature":20,"humidity":50}
```

También puedes actualizar el clima usando:

```bash
curl -X POST -d '{"temperature":22.5,"humidity":57}' http://localhost:3000/weather
{"temperature":22.5,"humidity":57}
```

Si llamamos nuevamente a:

```bash
curl -X GET http://localhost:3000/weather
{"temperature":22.5,"humidity":57}
```

## Continuación del proyecto

Hemos logrado dar los primeros pasos al implementar la arquitectura hexagonal en nuestro proyecto. Sin embargo, nuestro trabajo no se detiene aquí. El problema plantea nuevos desafíos, como la necesidad de controlar dispositivos, además de que aún no hemos solucionado nada relacionado con un invernadero. Desafortunadamente, no es posible abordar todos estos aspectos en un solo artículo. 
Este es solo el comienzo de nuestra historia. Seguiremos explorando y desarrollando soluciones para cubrir todas las necesidades planteadas. En futuros artículos, profundizaremos en la integración de dispositivos, la implementación de características específicas de un invernadero y otros aspectos importantes para completar nuestro proyecto.