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
// Configuration du moteur temps réel (WebSockets)
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());

const {
  DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_BOT_TOKEN,
  DISCORD_GUILD_ID, DISCORD_REDIRECT_URI, JWT_SECRET, PORT
} = process.env;

const ALLOWED_ROLES = ['1427651124231405610', '1427651123606589446'];

// --- BASE DE DONNÉES EN MÉMOIRE (TEMPS RÉEL) ---
let activeUnits = [];
let activeZones = [];

// --- GESTION DES CONNEXIONS EN DIRECT ---
io.on('connection', (socket) => {
  console.log(`[SYS] Nouvel agent connecté : ${socket.id}`);
  
  // Envoi de la situation actuelle au nouvel arrivant
  socket.emit('sync_data', { units: activeUnits, zones: activeZones });

  // Un agent déploie une unité
  socket.on('deploy_unit', (unitData) => {
    const newUnit = { id: socket.id, ...unitData };
    activeUnits.push(newUnit);
    io.emit('sync_units', activeUnits); // On prévient tout le monde
  });

  // Un agent trace une zone
  socket.on('add_zone', (zone) => {
    activeZones.push({ id: Math.random().toString(36).substr(2, 9), socketId: socket.id, ...zone });
    io.emit('sync_zones', activeZones);
  });

  // Déconnexion d'un agent (on retire son unité)
  socket.on('disconnect', () => {
    activeUnits = activeUnits.filter(u => u.id !== socket.id);
    io.emit('sync_units', activeUnits);
    console.log(`[SYS] Agent déconnecté : ${socket.id}`);
  });
});

// --- AUTHENTIFICATION DISCORD ---
app.get('/auth/discord', (req, res) => {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify`;
  res.redirect(url);
});

app.get('/auth/discord/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Code manquant');

  try {
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: DISCORD_CLIENT_ID, client_secret: DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code', code: code, redirect_uri: DISCORD_REDIRECT_URI,
    }).toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

    const accessToken = tokenResponse.data.access_token;
    const userResponse = await axios.get('https://discord.com/api/users/@me', { headers: { Authorization: `Bearer ${accessToken}` } });
    const { id: userId, username } = userResponse.data;

    const memberResponse = await axios.get(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${userId}`, { headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` } });
    const hasAccess = memberResponse.data.roles.some(role => ALLOWED_ROLES.includes(role));

    if (hasAccess) {
      const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '12h' });
      res.redirect(`/login?token=${token}`);
    } else {
      res.redirect(`/login?error=unauthorized`);
    }
  } catch (error) {
    res.redirect(`/login?error=server_error`);
  }
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get(/.*/, (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

// IMPORTANT: On utilise server.listen pour que Socket.io fonctionne avec Express
server.listen(PORT || 3001, () => {
  console.log(`[SYS] Serveur tactique en ligne sur le port ${PORT || 3001}`);
});