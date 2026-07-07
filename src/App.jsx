import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MapInterface from './pages/MapInterface';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* L'URL dynamique :faction permet d'avoir la même page pour LSPD, BCSO ou GLOBAL */}
        <Route path="/map/:faction" element={<MapInterface />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;