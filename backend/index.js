import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import msgsRouter from "./routes/msgs.route.js"
import connectToMongoDB from './db/mongoDBconnection.js';
import { addMsgToConversation } from './controllers/msgs.controller.js';
import { subscribe, publish } from "./redis/msgsPubSub.js";
dotenv.config();

const port = process.env.PORT || 8080;

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


    const channelName = `chat_${username}`
    subscribe(channelName, (msg) => {
        console.log('Received message:', msg);
        socket.emit("chat msg", JSON.parse(msg));
    });


    socket.on('chat msg', (msg) => {
        // console.log(msg.sender);
        // console.log(msg.receiver);
        // console.log(msg.text);
        // console.log(msg);
        const receiverSocket = userSocketMap[msg.receiver];
        if (receiverSocket) {
            //both sender and receiver are connected to same BE
            receiverSocket.emit('chat msg', msg);
        } else {
            // sender and receiver on diff BEs, so we need to use pubsub
            const channelName = `chat_${msg.receiver}`
            publish(channelName, JSON.stringify(msg));
        }

        addMsgToConversation([msg.sender, msg.receiver], {
            text: msg.text,
            sender: msg.sender,
            receiver: msg.receiver
        }
        )
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