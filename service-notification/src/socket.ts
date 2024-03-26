import { Socket, Server } from "socket.io";

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
            socket.on("new_user_online", (userId) => {
                this.clientConnected.push({
                    user: userId,
                    socket: socket.id
                });
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

