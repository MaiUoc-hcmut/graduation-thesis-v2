const messageRouter = require('./message');

function route(app: any) {
    app.use('/api/v1/messages', messageRouter);
}

module.exports = route;