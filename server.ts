import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import Message, {} from './domain/message'

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST']
    }
});
const port: number = 7000;

// Used to store association between usernames and socket ids
let users: Map<string, string> = new Map<string, string>();

// Fired upon new connection
io.sockets.on('connection', (socket: Socket) => {
    console.log(`New connection from ${socket.handshake.address}, giving id of ${socket.id} (current number of connected sockets ${io.sockets.sockets.size})`);
    
    // Checking if there is a free spot on the server
    if(io.sockets.sockets.size < 6) {
        socket.emit('chatAvailable', true);
        console.log(`New connection of id ${socket.id} is allowed to assign a username`);
    }else {
        socket.emit('chatAvailable', false);
        console.log(`New connection of id ${socket.id} is not allowed to assign a username`);
    }

    // Fired upon setting a clients username
    socket.on('updateUsername', (username) => {
        users.set(socket.id, username);
        console.log(`Socket id ${socket.id} has assigned username of ${username}`);
    });

    socket.on('sendMessage', (message: Message) => {
        //TODO: Forward message to other users except this one
    });

    // Fired upon a socket (client) disconnection from the server
    socket.on('disconnect', () => {
        users.delete(socket.id);
        console.log(`Connection on address ${socket.handshake.address} lost, discarding id ${socket.id} (current number of connected sockets ${io.sockets.sockets.size})`);
    });
});

console.log(`Listening on port: ${port}...`)

httpServer.listen(port);

//TODO: Implement callback function to original connection function in order to prove the connection was successful
//TODO: Implement functionality that localizes the time of each message