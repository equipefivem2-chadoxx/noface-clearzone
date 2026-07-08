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

// Récupération de toutes tes variables d'environnement
const {
  DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_BOT_TOKEN,
  DISCORD_GUILD_ID, DISCORD_REDIRECT_URI, JWT_SECRET, PORT
} = process.env;

const ALLOWED_ROLES = ['1427651124231405610', '1427651123606589446'];

// --- SYSTÈME DE SAUVEGARDE PERSISTANTE ---
const DATA_FILE = path.join(__dirname, 'data.json');
let activeUnits = [];
let activeZones = [];
let isMaintenance = false; // Variable globale pour la maintenance

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

// --- WEBSOCKET (SOCKET.IO) : GESTION DE LA CARTE ---
io.on('connection', (socket) => {
  console.log(`[SYS] Nouvel agent connecté : ${socket.id}`);
  
  // Envoi de la data + l'état de la maintenance au nouvel arrivant
  socket.emit('sync_data', { units: activeUnits, zones: activeZones });
  socket.emit('maintenance_state', isMaintenance);

  socket.on('request_sync', () => {
    socket.emit('sync_data', { units: activeUnits, zones: activeZones });
  });

  // --- MAINTENANCE ---
  socket.on('toggle_maintenance', (state) => {
    isMaintenance = state;
    io.emit('maintenance_state', isMaintenance);
    console.log(`[SYS] Maintenance: ${isMaintenance ? 'ACTIVE' : 'INACTIVE'}`);
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
});

// --- ROUTES D'AUTHENTIFICATION DISCORD ---

// 1. Redirige l'utilisateur vers la page de connexion Discord
app.get('/auth/discord', (req, res) => {
  if (!DISCORD_CLIENT_ID || !DISCORD_REDIRECT_URI) {
    console.error("[SYS] Variables d'environnement Discord manquantes !");
    return res.status(500).send("Configuration serveur incomplète.");
  }
  
  const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify`;
  res.redirect(authUrl);
});

// 2. Gère le retour de Discord avec le code d'autorisation
app.get('/auth/discord/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.redirect('/login?error=no_code');
  }

  try {
    // A. Échange le code contre un token d'accès Discord
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: DISCORD_REDIRECT_URI,
    }).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const accessToken = tokenResponse.data.access_token;

    // B. Récupère l'ID de l'utilisateur
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const userId = userResponse.data.id;
    const username = userResponse.data.username; // On récupère le pseudo

    // C. Vérifie les rôles sur le serveur Discord de la faction
    const memberResponse = await axios.get(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${userId}`, {
      headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
    });
    
    const userRoles = memberResponse.data.roles;
    const hasRole = userRoles.some(role => ALLOWED_ROLES.includes(role));

    if (!hasRole) {
      return res.redirect('/login?error=unauthorized');
    }

    // D. Crée le token du site pour maintenir la session ouverte (avec ID et Username)
    const siteToken = jwt.sign({ id: userId, username }, JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });

    // E. Redirige vers le front avec le token validé
    res.redirect(`/login?token=${siteToken}`);

  } catch (error) {
    console.error("[SYS] Erreur OAuth Discord:", error.response?.data || error.message);
    res.redirect('/login?error=auth_failed');
  }
});

// --- SERVEUR STATIQUE POUR LE FRONTEND (REACT) ---
app.use(express.static(path.join(__dirname, 'dist')));
app.get(/.*/, (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

// --- DÉMARRAGE DU SERVEUR ---
server.listen(PORT || 3001, () => {
  console.log(`[SYS] Serveur tactique en ligne sur le port ${PORT || 3001}`);
});