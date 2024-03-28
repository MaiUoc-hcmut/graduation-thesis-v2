import { Socket, Server } from "socket.io";
const RoomSocket = require('./db/model/room');

export class SOCKETIO {
    private io: Server;
    private clientConnected: {
        user: string,
        socket: string,
    }[];

    constructor(server: any) {
        this.clientConnected = [];
        this.io = new Server(server, { 
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            }
        });

        this.setupSocketEvents();
    }

    private setupSocketEvents() {
        this.io.on("connection", (socket: Socket) => {
            console.log(`New user connected: ${socket.id}`)
            
            socket.on("new_user_online", async (userId) => {
                this.clientConnected.push({
                    user: userId,
                    socket: socket.id
                });

                // Join room when user online
                const userInRooms = await RoomSocket.findAll({
                    where: { id_user: userId }
                });

                for (const record of userInRooms) {
                    socket.join(`${record.room}`);
                }

            });

            socket.on("user_join_room", async (data) => {
                socket.join(`${data.room}`);

                const userInRoom = await RoomSocket.findOne({
                    where: { id_user: data.userId, room: data.room }
                });

                if (!userInRoom) {
                    await RoomSocket.create({
                        id_user: data.userId,
                        room: data.room
                    });
                }
            });

            socket.on("disconnect", () => {
                console.log(`User disconnected: ${socket.id}`);
                this.clientConnected = this.clientConnected.filter(obj => obj.socket !== socket.id);
            });
        });
    }

    getIoInstance() {
        return this.io;
    }

    getClientConnected() {
        return this.clientConnected;
    }
}

