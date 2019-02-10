const routes = require('next-routes')();

routes
    .add('/questions/new', '/questions/new')
    .add('/questions/:address', '/questions/show')
    .add('/questions/:address/answers', '/questions/answers/index');

module.exports = routes;