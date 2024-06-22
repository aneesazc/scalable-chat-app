import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import msgsRouter from "./routes/msgs.route.js"
import connectToMongoDB from './db/mongoDBconnection.js';
import { addMsgToConversation } from './controllers/msgs.controller.js';
dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { // io is the instance of the socket.io server class
    cors: {
        credentials: true,
        origin: '*',
    },
});


const userSocketMap = {};

io.on('connection', (socket) => {
    const username = socket.handshake.query.username;
    console.log('Username of connected client:', username);
    userSocketMap[username] = socket;
    socket.on('chat msg', (msg) => {
        const receiverSocket = userSocketMap[msg.receiver];
        if (receiverSocket) {
            receiverSocket.emit('chat msg', msg);
        }
        addMsgToConversation([msg.sender, msg.receiver], msg);
    });
})

// cors
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}));

app.use('/msgs', msgsRouter);

app.get('/', (req, res) => {
    res.send('Hello World');
});

server.listen(port, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${port}`);
});