import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importations de tes pages
import Home from './pages/Home.jsx';
import MapInterface from './pages/Mapinterface.jsx';
import Login from './pages/Login.jsx';

// 🛑 Le garde du corps : Composant qui vérifie si l'utilisateur est connecté
const ProtectedRoute = ({ children }) => {
  // Pour le moment, on lit le localStorage (défini dans la simulation du Login.jsx).
  // Quand tu auras lié ton bot Discord, c'est ici que tu vérifieras si le token de l'utilisateur est valide.
  const isAuthenticated = localStorage.getItem('auth_token');
  
  if (!isAuthenticated) {
    // Si pas connecté, on le vire sur la page /login
    return <Navigate to="/login" replace />;
  }
  
  // Si tout est bon, on affiche la page demandée
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* La route publique pour se connecter */}
        <Route path="/login" element={<Login />} />

        {/* 🔒 Les routes protégées (il faut être passé par le login pour les voir) */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/map/:faction" 
          element={
            <ProtectedRoute>
              <MapInterface />
            </ProtectedRoute>
          } 
        /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;