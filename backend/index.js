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

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("chat msg", (msg) => {
        console.log("Received message: " + msg);
        socket.broadcast.emit("chat msg", msg);
    });
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});