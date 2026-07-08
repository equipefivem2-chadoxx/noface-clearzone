import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ServerCrash, ShieldCheck, Crosshair } from 'lucide-react';

function Admin({ socket }) {
  const navigate = useNavigate();
  const [isMaintenance, setIsMaintenance] = useState(false);

  useEffect(() => {
    const onMaintenanceState = (state) => {
      setIsMaintenance(state);
    };

    socket.on('maintenance_state', onMaintenanceState);
    
    // LA CORRECTION : La page Admin demande l'état en direct dès qu'on l'ouvre
    socket.emit('check_maintenance');

    return () => socket.off('maintenance_state', onMaintenanceState);
  }, [socket]);

  const toggleMaintenance = () => {
    socket.emit('toggle_maintenance', !isMaintenance);
  };

  return (
    <div translate="no" className="min-h-screen bg-[#020202] text-slate-200 flex flex-col p-8 font-sans relative overflow-hidden">
      {/* Background technique */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] z-0 opacity-20"></div>

      <header className="flex items-center gap-6 mb-16 relative z-10">
        <button onClick={() => navigate('/')} className="p-4 bg-[#0a0a0a] border border-neutral-800 hover:border-white hover:bg-white hover:text-black rounded-xl transition-all duration-300 group">
          <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <Crosshair className="w-6 h-6 text-neutral-500" />
            <h1 className="text-3xl font-black tracking-[0.2em] uppercase text-white">
              Clear<span className="font-light text-neutral-500">Zone</span> <span className="text-neutral-700">//</span> Supervision
            </h1>
          </div>
          <p className="text-xs font-mono text-neutral-500 tracking-[0.3em] uppercase mt-2 ml-9">Terminal Administrateur</p>
        </div>
      </header>

      <div className="relative z-10 max-w-2xl mx-auto w-full mt-10">
        <div className="p-10 bg-[#050505]/90 backdrop-blur-xl border border-neutral-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          
          <div className="flex items-center gap-5 mb-10 pb-10 border-b border-neutral-900">
            <div className="p-4 bg-black border border-neutral-800 rounded-2xl">
              <ServerCrash className="w-10 h-10 text-neutral-400" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-[0.2em] uppercase text-white">Contrôle du Réseau</h2>
              <p className="text-xs font-mono text-neutral-500 mt-2 tracking-widest uppercase">Gestion des accès distants tactiques</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-8 bg-[#0a0a0a] border border-neutral-800 rounded-2xl hover:border-neutral-700 transition-colors">
            <div className="flex items-center gap-6">
              <div className="relative flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full blur-md ${isMaintenance ? 'bg-red-500/50' : 'bg-green-500/50'}`}></div>
                <div className={`w-4 h-4 rounded-full relative z-10 ${isMaintenance ? 'bg-red-500' : 'bg-green-500'}`}></div>
              </div>
              <div>
                <div className="text-lg font-black tracking-[0.2em] uppercase text-white mb-1">Mode Maintenance</div>
                <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                  {isMaintenance ? (
                    <><span className="text-red-500">●</span> Verrouillage Global Actif</>
                  ) : (
                    <><span className="text-green-500">●</span> Télémétrie Opérationnelle</>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={toggleMaintenance}
              className={`px-8 py-4 rounded-xl text-xs font-bold font-mono tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-3 ${
                isMaintenance 
                ? 'bg-red-950/30 text-red-500 border border-red-900 hover:bg-red-600 hover:text-white hover:border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                : 'bg-white text-black border border-white hover:bg-neutral-300 hover:border-neutral-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
              }`}
            >
              {isMaintenance ? <ShieldCheck className="w-4 h-4" /> : <ServerCrash className="w-4 h-4" />}
              {isMaintenance ? 'Rétablir Accès' : 'Verrouiller'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;