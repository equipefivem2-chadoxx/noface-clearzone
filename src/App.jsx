import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';

// Importations de tes pages
import Home from './pages/Home.jsx';
import MapInterface from './pages/Mapinterface.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import Maintenance from './pages/Maintenance.jsx';

// ⚠️ TON ID DISCORD
export const ADMIN_DISCORD_ID = "1247264549489610897"; 

const socket = io(window.location.origin.includes('localhost') ? 'http://localhost:3001' : window.location.origin);

// Décodage du token pour lire l'ID de l'utilisateur
export const getUserData = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  try { return JSON.parse(atob(token.split('.')[1])); } catch (e) { return null; }
};

// 🛑 Le garde du corps : Gère l'authentification ET la maintenance
const ProtectedRoute = ({ children }) => {
  const user = getUserData();
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    socket.on('maintenance_state', (state) => {
      setIsMaintenance(state);
      setLoading(false); // Débloque l'écran de chargement
    });

    // LA CORRECTION EST ICI : On force la demande au serveur 
    socket.emit('check_maintenance');

    return () => socket.off('maintenance_state');
  }, []);

  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <div className="h-screen w-screen bg-black text-neutral-500 flex items-center justify-center font-mono text-xs">SYSTÈME EN LIGNE...</div>;
  
  // Redirection forcée si maintenance active (sauf pour l'Admin)
  if (isMaintenance && user.id !== ADMIN_DISCORD_ID) {
    return <Navigate to="/maintenance" replace />;
  }

  return children;
};

// Garde du corps spécifique pour la page Admin (Sécurité Max)
const AdminRoute = ({ children }) => {
  const user = getUserData();
  if (!user || user.id !== ADMIN_DISCORD_ID) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* On passe le socket à la page Maintenance pour le retour automatique */}
        <Route path="/maintenance" element={<Maintenance socket={socket} />} />

        {/* 🔒 Les routes protégées */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/map/:faction" element={<ProtectedRoute><MapInterface /></ProtectedRoute>} /> 

        {/* 🛡️ La route Administrateur */}
        <Route path="/admin" element={<AdminRoute><Admin socket={socket} /></AdminRoute>} />

        <Route path="*" element={<div className="text-white text-center mt-20 font-mono">Page introuvable (Erreur 404)</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;