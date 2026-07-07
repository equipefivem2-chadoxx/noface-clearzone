import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importation sécurisée avec l'extension .jsx pour les serveurs Linux
import Home from './pages/Home.jsx';
import MapInterface from './pages/MapInterface.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page d'accueil avec la sélection des services */}
        <Route path="/" element={<Home />} />
        
        {/* L'URL dynamique :faction génère la carte pour LSPD, BCSO ou GLOBAL avec le même composant */}
        <Route path="/map/:faction" element={<MapInterface />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;