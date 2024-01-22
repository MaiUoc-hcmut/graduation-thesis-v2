import { Server, Socket } from 'socket.io';


module.exports = function (server: any) {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    let clientsConnected: { [key: string]: any } = {};
    io.on('connection', (socket: Socket) => {
        // id of user pass to connection event
        let id = socket.handshake.query.id;
        let userIdConnect = '';
        
        if (Array.isArray(id)) userIdConnect = id[0];
        if (typeof id === 'string') userIdConnect = id;
        clientsConnected.userIdConnect = socket.id;

        socket.on('disconnected', (userId) => {
            delete clientsConnected.userId;
        })
    });

    return io;
}

