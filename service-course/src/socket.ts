import { Server } from 'socket.io';
import { Socket } from 'socket.io-client';

module.exports = function (server: any) {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    let clientsConnected: { [key: string]: any } = {};
    io.on('connection', (socket) => {
        // id of user pass to connection event
        socket.on('add-user-online', (newUser: any) => {
            clientsConnected[newUser.id] = socket.id;
        });

        socket.on('disconnected', (userId) => {
            delete clientsConnected[userId];
        });
    });

    return { io, clientsConnected };
}

