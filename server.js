const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const setupSockets = require('./socket/index.socket');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuration Moteur de vues
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', routes);

// Initialisation des Sockets
setupSockets(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`[SERVEUR] Tactical Map en ligne sur le port ${PORT}`);
});