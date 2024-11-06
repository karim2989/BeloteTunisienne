import * as io from "socket.io";
import * as http from "http";
import express = require("express");
import { Server as IoServer } from "socket.io";

async function Server() {
    const app = express();
    const server = http.createServer(app);
    const io = new IoServer(server);

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/www/index.html');
    })

    app.get('/script.js', (req, res) => {
        res.sendFile(__dirname + '/www/script.js');
    })

    io.on('connection', (socket) => {
        console.log('user ' + socket.id + ' connected');
      });

    server.listen(3000, () => {
        console.log('listening on *:3000');
    });
}

export { Server }