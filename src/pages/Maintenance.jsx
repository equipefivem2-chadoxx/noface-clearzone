import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldAlert } from 'lucide-react';

function Maintenance({ socket }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Écoute si l'admin désactive la maintenance
    socket.on('maintenance_state', (state) => {
      if (state === false) {
        navigate('/'); // Retour à l'accueil immédiat pour tous les agents
      }
    });
    return () => socket.off('maintenance_state');
  }, [socket, navigate]);

  return (
    <div translate="no" className="min-h-screen bg-[#020202] text-slate-200 flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
      
      {/* Grille Tactique & CRT */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_4px] z-0 opacity-40"></div>
      
      {/* Halo d'urgence */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-red-900/10 blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-xl p-10 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-red-900/50 rounded-2xl shadow-[0_0_50px_rgba(255,0,0,0.1)] flex flex-col items-center text-center">
        
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse"></div>
          <ShieldAlert className="w-24 h-24 text-red-500 relative z-10 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]" />
        </div>

        <div className="flex flex-col items-center gap-2 mb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-500 uppercase">
            Clear<span className="font-light text-red-500">Zone</span>
          </h1>
          <div className="h-[1px] w-24 bg-red-900/50"></div>
          <h2 className="text-xl font-bold tracking-[0.3em] text-white uppercase mt-2">
            Réseau Hors Ligne
          </h2>
        </div>

        <p className="text-neutral-400 text-xs mb-10 font-mono tracking-widest uppercase leading-relaxed px-4">
          Le système tactique global est actuellement en cours de maintenance. En attente de la réactivation par le commandement.
        </p>

        <div className="w-full py-4 bg-black border border-red-900/50 rounded flex items-center justify-center gap-3 overflow-hidden group">
          <Lock className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-red-500 font-bold">
            Verrouillage Système Actif
          </span>
        </div>
      </div>

      {/* Loader tactique en bas de l'écran */}
      <div className="absolute bottom-10 flex items-center gap-3">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
        <span className="text-neutral-600 font-mono text-[10px] uppercase tracking-widest">Tentative de reconnexion en arrière-plan...</span>
      </div>
    </div>
  );
}

export default Maintenance;