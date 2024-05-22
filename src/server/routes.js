const { postPredictHandler, historiesPredictHandler } = require('./handler');

const routes = [
    {
        path: '/predict',
        method: 'POST',
        handler: postPredictHandler,
        options: {
            payload: {
                maxBytes: 1000000, // 1MB limit
                parse: true,
                output: 'stream',
                allow: 'multipart/form-data',
                multipart: true
            }
        }
    },
    {
        path: '/predict/histories',
        method: 'GET',
        handler: historiesPredictHandler
    }
];

module.exports = routes;
