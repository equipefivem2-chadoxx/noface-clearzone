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

const DATA_FILE = path.join(__dirname, 'data.json');
let activeUnits = [];
let activeZones = [];
let operationTitles = {}; 
let isMaintenance = false; 

const loadData = () => {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      activeUnits = data.units || [];
      activeZones = data.zones || [];
      operationTitles = data.operationTitles || {};
    } catch (e) { console.error("[SYS] Erreur lecture data.json", e); }
  }
};

const saveData = () => {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ units: activeUnits, zones: activeZones, operationTitles }, null, 2));
};

loadData(); 

io.on('connection', (socket) => {
  console.log(`[SYS] Nouvel agent connecté : ${socket.id}`);
  
  socket.emit('maintenance_state', isMaintenance);

  // Connexion sécurisée à une faction spécifique (Isolation des salons)
  socket.on('join_faction', ({ faction }) => {
    socket.join(faction);
    socket.currentFaction = faction;
    console.log(`[SYS] Agent ${socket.id} a rejoint le salon tactique : ${faction}`);
    
    // Synchronisation exclusive des données de CETTE faction
    socket.emit('sync_faction_data', {
      units: activeUnits.filter(u => u.faction === faction),
      zones: activeZones.filter(z => z.faction === faction),
      operationTitle: operationTitles[faction] || `OPÉRATION STANDARD`
    });
  });

  socket.on('check_maintenance', () => {
    socket.emit('maintenance_state', isMaintenance);
  });

  socket.on('toggle_maintenance', (state) => {
    isMaintenance = state;
    io.emit('maintenance_state', isMaintenance);
    console.log(`[SYS] Maintenance: ${isMaintenance ? 'ACTIVE' : 'INACTIVE'}`);
  });

  // --- GESTION DES UNITÉS PAR ROOM ---
  socket.on('deploy_unit', (unitData) => {
    // Nettoyage de l'ancienne position pour éviter les doublons
    activeUnits = activeUnits.filter(u => !(u.callsign === unitData.callsign && u.faction === unitData.faction));
    activeUnits.push({ id: socket.id, ...unitData });
    saveData();
    
    // Diffusion uniquement aux membres de la même faction
    io.to(unitData.faction).emit('sync_units', activeUnits.filter(u => u.faction === unitData.faction));
  });

  socket.on('delete_global_unit', ({ callsign, faction }) => {
    activeUnits = activeUnits.filter(u => !(u.callsign === callsign && u.faction === faction));
    saveData();
    io.to(faction).emit('sync_units', activeUnits.filter(u => u.faction === faction));
  });

  // --- DESSINS TACTIQUES PAR ROOM ---
  socket.on('add_zone', (zoneData) => {
    const faction = zoneData.faction || socket.currentFaction;
    if (!faction) return;

    const newZone = { 
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5), 
      ...zoneData, 
      faction 
    };
    activeZones.push(newZone);
    saveData();
    io.to(faction).emit('sync_zones', activeZones.filter(z => z.faction === faction));
  });

  socket.on('delete_zone', ({ id, faction }) => {
    activeZones = activeZones.filter(z => !(z.id === id && z.faction === faction));
    saveData();
    io.to(faction).emit('sync_zones', activeZones.filter(z => z.faction === faction));
  });

  socket.on('undo_last_zone', ({ faction }) => {
    const factionZones = activeZones.filter(z => z.faction === faction);
    if (factionZones.length > 0) {
      const lastZone = factionZones[factionZones.length - 1];
      activeZones = activeZones.filter(z => z.id !== lastZone.id);
      saveData();
      io.to(faction).emit('sync_zones', activeZones.filter(z => z.faction === faction));
    }
  });

  socket.on('clear_all_zones', ({ faction }) => {
    activeZones = activeZones.filter(z => z.faction !== faction);
    saveData();
    io.to(faction).emit('sync_zones', []);
  });

  // --- TITRE DE L'OPÉRATION ---
  socket.on('update_operation_title', ({ faction, title }) => {
    operationTitles[faction] = title;
    saveData();
    io.to(faction).emit('sync_operation_title', title);
  });
  
  socket.on('disconnect', () => {
    console.log(`[SYS] Agent déconnecté : ${socket.id}`);
  });
});

// --- AUTH DISCORD OAUTH2 ---
app.get('/auth/discord', (req, res) => {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify`;
  res.redirect(url);
});

app.get('/auth/discord/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect('/login?error=no_code');
  try {
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
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const userId = userResponse.data.id;
    const username = userResponse.data.username; 

    const memberResponse = await axios.get(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${userId}`, {
      headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
    });
    
    const userRoles = memberResponse.data.roles;
    const hasRole = userRoles.some(role => ALLOWED_ROLES.includes(role));

    if (!hasRole) return res.redirect('/login?error=unauthorized');

    const siteToken = jwt.sign({ id: userId, username }, JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
    res.redirect(`/login?token=${siteToken}`);
  } catch (error) {
    console.error("[SYS] Erreur OAuth Discord:", error.response?.data || error.message);
    res.redirect('/login?error=auth_error');
  }
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(PORT || 3001, () => {
  console.log(`[SYS] Serveur ClearZone sur le port ${PORT || 3001}`);
});