import React from 'react';
import { AlertTriangle, Lock } from 'lucide-react';

function Maintenance() {
  return (
    <div translate="no" className="min-h-screen bg-[#050505] text-slate-200 flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
      
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_4px] z-0 opacity-40"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[60%] bg-red-900/10 blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-lg p-10 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-red-900/30 rounded-2xl shadow-[0_0_50px_rgba(255,0,0,0.1)] flex flex-col items-center text-center">
        
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse"></div>
          <AlertTriangle className="w-20 h-20 text-red-500 relative z-10 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        </div>

        <h1 className="text-3xl font-black text-white tracking-[0.2em] mb-2 uppercase">
          Réseau <span className="font-light text-red-500">Hors Ligne</span>
        </h1>
        <p className="text-neutral-400 text-xs mb-10 font-mono tracking-widest uppercase leading-loose">
          Le centre de commandement Iris'Studio est actuellement en cours de mise à jour tactique.
        </p>

        <div className="w-full py-4 bg-black border border-red-950 rounded flex items-center justify-center gap-3 overflow-hidden">
          <Lock className="w-4 h-4 text-red-500" />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-red-500 font-bold">
            Verrouillage Système Actif
          </span>
        </div>
      </div>
    </div>
  );
}

export default Maintenance;