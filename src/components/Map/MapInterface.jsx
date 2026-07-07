import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SanAndreasMap from '../components/Map/SanAndreasMap';

const MapInterface = () => {
  const { faction } = useParams(); // Récupère le service choisi (LSPD, BCSO...)
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 text-white overflow-hidden select-none relative">
      
      {/* Header Tactique Glassmorphism (z-10 pour être au-dessus de la carte) */}
      <header className="absolute top-0 left-0 w-full h-16 bg-slate-900/60 backdrop-blur-md z-[1000] flex items-center justify-between px-6 border-b border-slate-700/50 shadow-2xl">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
            <ArrowLeft className="w-6 h-6 text-slate-300" />
          </button>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
          <h1 className="text-xl font-black tracking-widest text-white uppercase">
            OPÉRATION <span className="text-blue-500">|</span> {faction}
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm font-mono text-slate-400">
          <span className="bg-slate-800 px-3 py-1 rounded border border-slate-700">STATUS: DEPLOYED</span>
        </div>
      </header>

      {/* Le composant modulaire de la carte */}
      <SanAndreasMap />

    </div>
  );
};

export default MapInterface;