require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const io = new Server(server, {
    cors: { origin: 'http://localhost:5173' }
});

// Initialisation modulaire des sockets
// On appellera le fichier index.js du dossier sockets
require('./sockets/index')(io);

app.get('/api/status', (req, res) => {
    res.json({ message: "Opérations Tactic - API Active", status: 200 });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`[SERVEUR] API démarrée sur le port ${PORT}`);
});