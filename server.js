import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

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
    // A. Échanger le code contre un token d'accès Discord
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

    // B. Récupérer l'ID de l'utilisateur
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const userId = userResponse.data.id;
    const username = userResponse.data.username;

    // C. Utiliser le Bot pour voir les rôles du joueur sur TON serveur
    const memberResponse = await axios.get(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${userId}`, {
      headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
    });
    
    const userRoles = memberResponse.data.roles;

    // D. Vérifier s'il a au moins un des rôles autorisés
    const hasAccess = userRoles.some(role => ALLOWED_ROLES.includes(role));

    if (hasAccess) {
      // Succès ! On crée un pass d'accès (JWT)
      const token = jwt.sign({ id: userId, username }, JWT_SECRET, { expiresIn: '12h' });
      // On le renvoie sur ton site React avec le pass
      res.redirect(`http://localhost:5173/login?token=${token}`);
    } else {
      // Refusé ! Pas le bon rôle.
      res.redirect(`http://localhost:5173/login?error=unauthorized`);
    }

  } catch (error) {
    console.error('Erreur Auth:', error.response?.data || error.message);
    res.redirect(`http://localhost:5173/login?error=server_error`);
  }
});

app.listen(PORT || 3001, () => {
  console.log(`[SYS] Serveur d'authentification en ligne sur le port ${PORT || 3001}`);
});