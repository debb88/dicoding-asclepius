require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/InputError');

(async () => {
  const server = Hapi.server({
    port: 3000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const model = await loadModel();
  server.app.model = model;

  server.route(routes);

  server.ext('onPreResponse', (request, h) => {
    const response = request.response;

    if (response instanceof InputError) {
      const newResponse = h.response({
        status: 'fail',
        message: 'Terjadi kesalahan dalam melakukan prediksi',
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    if (response.isBoom) {
      let statusCode = response.output.statusCode;
      let message = response.message;

      if (
        response.message.includes(
          'Payload content length greater than maximum allowed',
        )
      ) {
        statusCode = 413;
        message =
          'Payload content length greater than maximum allowed: 1000000';
      }

      const newResponse = h.response({
        status: 'fail',
        message: message,
      });

      newResponse.code(statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server started at: ${server.info.uri}`);
})();
