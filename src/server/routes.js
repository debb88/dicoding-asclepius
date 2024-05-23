const { postPredictHandler, historiesPredictHandler } = require('./handler');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        maxBytes: 1048576, // 1MB limit
        allow: 'multipart/form-data',
        parse: true,
        multipart: true,
      },
    },
  },
  {
    path: '/predict/histories',
    method: 'GET',
    handler: historiesPredictHandler,
  },
];

module.exports = routes;
