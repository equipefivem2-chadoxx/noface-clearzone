import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Configuration pour lire les fichiers locaux
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_BOT_TOKEN,
  DISCORD_GUILD_ID,
  DISCORD_REDIRECT_URI,
  JWT_SECRET,
  PORT
} = process.env;

// Les deux rôles autorisés (LSPD / BCSO)
const ALLOWED_ROLES = ['1427651124231405610', '1427651123606589446'];

// 1. Route pour envoyer l'utilisateur vers Discord
app.get('/auth/discord', (req, res) => {
  const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify`;
  res.redirect(url);
});

// 2. Route de retour (Callback) de Discord
app.get('/auth/discord/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Code manquant');

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
    const hasAccess = userRoles.some(role => ALLOWED_ROLES.includes(role));

    if (hasAccess) {
      const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '12h' });
      // Redirection dynamique (fonctionne sur Railway et en local)
      res.redirect(`/login?token=${token}`);
    } else {
      res.redirect(`/login?error=unauthorized`);
    }

  } catch (error) {
    console.error('Erreur Auth:', error.response?.data || error.message);
    res.redirect(`/login?error=server_error`);
  }
});

// --- FUSION : LE BACKEND HÉBERGE LE FRONTEND ---
// On sert les fichiers statiques (le site React généré dans le dossier dist)
app.use(express.static(path.join(__dirname, 'dist')));

// Pour n'importe quelle autre route, on renvoie l'interface React
app.get('/(.*)', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
// -----------------------------------------------

app.listen(PORT || 3001, () => {
  console.log(`[SYS] Serveur central en ligne sur le port ${PORT || 3001}`);
});