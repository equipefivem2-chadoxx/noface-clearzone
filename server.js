const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let drawHistory = [];

io.on('connection', (socket) => {
    socket.emit('load_history', drawHistory);

    socket.on('draw', (data) => {
        drawHistory.push(data);
        socket.broadcast.emit('draw', data);
    });

    socket.on('clear_map', () => {
        drawHistory = [];
        io.emit('clear_map');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur prêt sur le port ${PORT}`);
});