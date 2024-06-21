import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { // io is the instance of the socket.io server class
    cors: {
        origin: '*',
    },
});

io.on("connection", (socket) => {
    console.log('Client connected');
    const username = socket.handshake.query.username;
    console.log('Username:', username);
    socket.on('chat msg', (msg) => {
        console.log(msg.sender);
        console.log(msg.receiver);
        console.log(msg.text);

    });
})


app.get('/', (req, res) => {
    res.send('Hello World');
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});