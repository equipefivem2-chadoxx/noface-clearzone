import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());

const {
  DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_BOT_TOKEN,
  DISCORD_GUILD_ID, DISCORD_REDIRECT_URI, JWT_SECRET, PORT
} = process.env;

const ALLOWED_ROLES = ['1427651124231405610', '1427651123606589446'];

// --- SYSTÈME DE SAUVEGARDE PERSISTANTE ---
const DATA_FILE = path.join(__dirname, 'data.json');
let activeUnits = [];
let activeZones = [];

const loadData = () => {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      activeUnits = data.units || [];
      activeZones = data.zones || [];
    } catch (e) { console.error("[SYS] Erreur lecture data.json", e); }
  }
};
const saveData = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ units: activeUnits, zones: activeZones }, null, 2));
};

loadData(); // Chargement au démarrage

io.on('connection', (socket) => {
  console.log(`[SYS] Nouvel agent connecté : ${socket.id}`);
  socket.emit('sync_data', { units: activeUnits, zones: activeZones });

  // NOUVEAU : Répond à la demande explicite de synchro d'un client
  socket.on('request_sync', () => {
    socket.emit('sync_data', { units: activeUnits, zones: activeZones });
  });

  // --- UNITÉS ---
  socket.on('deploy_unit', (unitData) => {
    const existingIndex = activeUnits.findIndex(u => u.callsign === unitData.callsign);
    if (existingIndex !== -1) {
      activeUnits[existingIndex] = { ...activeUnits[existingIndex], ...unitData };
    } else {
      activeUnits.push({ id: socket.id, ...unitData });
    }
    saveData();
    io.emit('sync_units', activeUnits);
  });

  // Supprime l'unité pour tout le monde (efface du serveur)
  socket.on('delete_global_unit', (callsign) => {
    activeUnits = activeUnits.filter(u => u.callsign !== callsign);
    saveData();
    io.emit('sync_units', activeUnits);
  });

  // --- ZONES ---
  socket.on('add_zone', (zone) => {
    activeZones.push({ id: Math.random().toString(36).substr(2, 9), socketId: socket.id, ...zone });
    saveData();
    io.emit('sync_zones', activeZones);
  });

  socket.on('delete_zone', (zoneId) => {
    activeZones = activeZones.filter(z => z.id !== zoneId);
    saveData();
    io.emit('sync_zones', activeZones);
  });

  socket.on('undo_last_zone', () => {
    const index = activeZones.map(z => z.socketId).lastIndexOf(socket.id);
    if (index !== -1) {
      activeZones.splice(index, 1);
      saveData();
      io.emit('sync_zones', activeZones);
    }
  });

  socket.on('clear_all_zones', () => {
    activeZones = activeZones.filter(z => z.socketId !== socket.id);
    saveData();
    io.emit('sync_zones', activeZones);
  });

  // Note : On ne supprime plus l'unité lors du 'disconnect' pour garder la persistance.
});

// Routes Discord Omises pour la lisibilité, garde les tiennes :
// app.get('/auth/discord', ...)
// app.get('/auth/discord/callback', ...)

app.use(express.static(path.join(__dirname, 'dist')));
app.get(/.*/, (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

server.listen(PORT || 3001, () => console.log(`[SYS] Serveur tactique en ligne sur le port ${PORT || 3001}`));