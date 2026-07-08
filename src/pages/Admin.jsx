import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ServerCrash } from 'lucide-react';

function Admin({ socket }) {
  const navigate = useNavigate();
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    socket.on('maintenance_state', (state) => setIsMaintenance(state));
    return () => socket.off('maintenance_state');
  }, [socket]);

  const toggleMaintenance = () => {
    socket.emit('toggle_maintenance', !isMaintenance);
  };

  return (
    <div translate="no" className="min-h-screen bg-[#020202] text-slate-200 flex flex-col p-8 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>

      <header className="flex items-center gap-4 mb-12 relative z-10">
        <button onClick={() => navigate('/')} className="p-3 border border-neutral-800 hover:border-white rounded-lg transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black tracking-[0.2em] uppercase text-white">Iris'Studio // Supervision</h1>
          <p className="text-xs font-mono text-neutral-500 tracking-widest uppercase mt-1">Terminal Administrateur</p>
        </div>
      </header>

      <div className="relative z-10 max-w-xl">
        <div className="p-8 bg-[#0a0a0a] border border-neutral-800 rounded-2xl">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-neutral-900">
            <ServerCrash className="w-8 h-8 text-neutral-400" />
            <div>
              <h2 className="text-lg font-bold tracking-widest uppercase text-white">État du Réseau</h2>
              <p className="text-xs font-mono text-neutral-500 mt-1">Gestion des accès distants</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 bg-black border border-neutral-800 rounded-xl">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full animate-pulse ${isMaintenance ? 'bg-red-500 shadow-[0_0_15px_#ef4444]' : 'bg-green-500 shadow-[0_0_15px_#22c55e]'}`}></div>
              <div>
                <div className="text-sm font-bold tracking-wider uppercase text-white">Mode Maintenance</div>
                <div className="text-[10px] font-mono text-neutral-500 mt-1 uppercase">{isMaintenance ? 'Verrouillage Actif' : 'Télémétrie Active'}</div>
              </div>
            </div>

            <button 
              onClick={toggleMaintenance}
              className={`px-6 py-3 rounded text-xs font-bold font-mono tracking-widest uppercase transition-all ${isMaintenance ? 'bg-red-950/50 text-red-500 border border-red-900 hover:bg-red-900 hover:text-white' : 'bg-white text-black hover:bg-neutral-300'}`}
            >
              {isMaintenance ? 'Désactiver' : 'Activer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;