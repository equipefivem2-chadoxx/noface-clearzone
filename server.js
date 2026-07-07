import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import path from 'path';
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

let activeUnits = [];
let activeZones = [];

io.on('connection', (socket) => {
  console.log(`[SYS] Nouvel agent connecté : ${socket.id}`);
  socket.emit('sync_data', { units: activeUnits, zones: activeZones });

  // --- UNITÉS ---
  socket.on('deploy_unit', (unitData) => {
    // Vérifie si l'unité existe déjà (pour la rejoindre plutôt que la dupliquer)
    const existingIndex = activeUnits.findIndex(u => u.callsign === unitData.callsign);
    if (existingIndex !== -1) {
      activeUnits[existingIndex] = { ...activeUnits[existingIndex], ...unitData };
    } else {
      activeUnits.push({ id: socket.id, ...unitData });
    }
    io.emit('sync_units', activeUnits);
  });

  socket.on('delete_unit', () => {
    activeUnits = activeUnits.filter(u => u.id !== socket.id);
    io.emit('sync_units', activeUnits);
  });

  // --- ZONES ---
  socket.on('add_zone', (zone) => {
    activeZones.push({ id: Math.random().toString(36).substr(2, 9), socketId: socket.id, ...zone });
    io.emit('sync_zones', activeZones);
  });

  socket.on('delete_zone', (zoneId) => {
    activeZones = activeZones.filter(z => z.id !== zoneId);
    io.emit('sync_zones', activeZones);
  });

  // Annuler SON dernier tracé
  socket.on('undo_last_zone', () => {
    const index = activeZones.map(z => z.socketId).lastIndexOf(socket.id);
    if (index !== -1) {
      activeZones.splice(index, 1);
      io.emit('sync_zones', activeZones);
    }
  });

  // Supprimer TOUTES SES zones
  socket.on('clear_all_zones', () => {
    activeZones = activeZones.filter(z => z.socketId !== socket.id);
    io.emit('sync_zones', activeZones);
  });

  // --- DÉCONNEXION ---
  socket.on('disconnect', () => {
    activeUnits = activeUnits.filter(u => u.id !== socket.id);
    io.emit('sync_units', activeUnits);
  });
});

app.get('/auth/discord', (req, res) => {
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify`);
});

app.get('/auth/discord/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Code manquant');
  try {
    const tokenRes = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({ client_id: DISCORD_CLIENT_ID, client_secret: DISCORD_CLIENT_SECRET, grant_type: 'authorization_code', code, redirect_uri: DISCORD_REDIRECT_URI }).toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    const userRes = await axios.get('https://discord.com/api/users/@me', { headers: { Authorization: `Bearer ${tokenRes.data.access_token}` } });
    const memberRes = await axios.get(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${userRes.data.id}`, { headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` } });
    
    if (memberRes.data.roles.some(role => ALLOWED_ROLES.includes(role))) {
      res.redirect(`/login?token=${jwt.sign({ id: userRes.data.id, username: userRes.data.username }, JWT_SECRET, { expiresIn: '12h' })}`);
    } else res.redirect(`/login?error=unauthorized`);
  } catch (error) { res.redirect(`/login?error=server_error`); }
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get(/.*/, (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

server.listen(PORT || 3001, () => console.log(`[SYS] Serveur tactique en ligne sur le port ${PORT || 3001}`));