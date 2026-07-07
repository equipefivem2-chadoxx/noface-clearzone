import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Radio, Target, Activity } from 'lucide-react';
import SanAndreasMap from '../components/Map/SanAndreasMap';

const MapInterface = () => {
  const { faction } = useParams(); // Récupère le service choisi (LSPD, BCSO...)
  const navigate = useNavigate();

  // Petite logique pour adapter un mini-détail selon la faction si tu veux, tout en restant Black & White
  const factionLabel = faction ? faction.toUpperCase() : 'UNKNOWN';

  return (
    <div className="w-screen h-screen flex flex-col bg-black text-slate-200 overflow-hidden select-none relative font-sans">
      
      {/* HEADER TACTIQUE PREMIUM (z-[1000] pour survoler la carte) */}
      <header className="absolute top-4 left-4 right-4 h-16 bg-[#050505]/80 backdrop-blur-xl z-[1000] flex items-center justify-between px-6 border border-neutral-800 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        
        {/* Partie gauche : Navigation & Titre de l'Opération */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 border border-neutral-800 hover:border-white bg-black hover:bg-white hover:text-black rounded-lg transition-all duration-300 cursor-pointer group"
            title="Retour au centre de commandement"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </button>
          
          <div className="h-6 w-[1px] bg-neutral-800"></div>
          
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-white opacity-70 animate-pulse" />
            <h1 className="text-sm font-black tracking-[0.25em] text-white uppercase">
              RESEAU TACTIQUE <span className="text-neutral-500 font-light">//</span> {factionLabel}
            </h1>
          </div>
        </div>

        {/* Partie droite : Télémétrie et Statut Système */}
        <div className="flex items-center gap-6 font-mono text-xs">
          
          {/* Indicateur de Fréquence / Canal */}
          <div className="hidden md:flex items-center gap-2 text-neutral-500 tracking-wider">
            <Radio className="w-4 h-4 text-neutral-400" />
            <span>NET_CH: <span className="text-white font-bold">SEC_0{factionLabel === 'GLOBAL' ? '0' : '1'}</span></span>
          </div>

          <div className="hidden md:block h-4 w-[1px] bg-neutral-800"></div>

          {/* Badge Statut */}
          <div className="flex items-center gap-3 bg-black px-4 py-2 border border-neutral-800 rounded-lg shadow-inner">
            <span className="w-2 h-2 bg-white rounded-full animate-[ping_1.5s_infinite] shadow-[0_0_8px_rgba(255,255,255,1)]"></span>
            <span className="text-neutral-400 tracking-widest font-bold text-[10px] uppercase">
              STATUS: EN LIGNE
            </span>
          </div>
        </div>
      </header>

      {/* Le composant modulaire de la carte */}
      <SanAndreasMap />

      {/* FILTRE DE COIN TACTIQUE (Donne un look de moniteur militaire) */}
      <div className="absolute bottom-4 left-4 z-[1000] pointer-events-none font-mono text-[10px] text-neutral-600 tracking-widest uppercase">
        [SYS_OP: DISPATCH_READY]
      </div>
      <div className="absolute bottom-4 right-4 z-[1000] pointer-events-none font-mono text-[10px] text-neutral-600 tracking-widest uppercase flex items-center gap-2">
        <Activity className="w-3 h-3 animate-pulse" /> GRID_SCALE: 1:1
      </div>

    </div>
  );
};

export default MapInterface;