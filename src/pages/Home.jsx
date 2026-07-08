import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldAlert, Globe, Crosshair, Fingerprint, Lock } from 'lucide-react';
import { getUserData, ADMIN_DISCORD_ID } from '../App';

function Home() {
  const navigate = useNavigate();
  
  // Vérification de l'identité pour afficher ou non le bouton Admin
  const user = getUserData();
  const isAdmin = user && user.id === ADMIN_DISCORD_ID;

  return (
    <div className="min-h-screen bg-black text-slate-200 flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
      
      {/* 1. GRILLE TACTIQUE ET ARRIÈRE-PLAN */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] z-0 opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* 2. CONTENEUR PRINCIPAL */}
      <div className="max-w-6xl w-full z-10 flex flex-col items-center">
        
        {/* En-tête du centre opérationnel */}
        <div className="text-center mb-20 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 blur-[2px]"></div>
          
          <div className="flex items-center justify-center gap-6 mb-4">
            <Crosshair className="w-10 h-10 text-white opacity-70 animate-[spin_10s_linear_infinite]" />
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-neutral-500 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] uppercase">
              Clear<span className="font-light text-neutral-400">Zone</span>
            </h1>
            <Fingerprint className="w-10 h-10 text-white opacity-70 animate-pulse" />
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-neutral-600"></div>
            <p className="text-neutral-400 tracking-[0.4em] font-mono text-xs md:text-sm uppercase">
              Système de Commandement Tactique
            </p>
            <div className="h-[1px] w-12 bg-neutral-600"></div>
          </div>
        </div>

        {/* 3. SÉLECTION DES SERVICES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4">
          
          {/* CARTE LSPD */}
          <button onClick={() => navigate('/map/LSPD')} className="group relative p-10 bg-[#050505]/80 backdrop-blur-xl border border-neutral-800 hover:border-white rounded-xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:-translate-y-1 flex flex-col items-center text-center overflow-hidden cursor-pointer w-full">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-0 group-hover:opacity-100 group-hover:animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <Shield className="w-16 h-16 text-neutral-500 mb-6 group-hover:text-white group-hover:scale-110 transition-all duration-500 group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]" />
            <h2 className="text-3xl font-black text-white tracking-[0.2em] mb-2 z-10">LSPD</h2>
            <p className="text-neutral-500 text-xs mb-8 font-mono tracking-widest z-10">LOS SANTOS POLICE</p>
            <div className="mt-auto px-8 py-3 border border-neutral-700 bg-black text-neutral-400 text-[10px] rounded uppercase tracking-[0.3em] font-bold group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300 z-10 w-full">Initialiser</div>
          </button>

          {/* CARTE BCSO */}
          <button onClick={() => navigate('/map/BCSO')} className="group relative p-10 bg-[#050505]/80 backdrop-blur-xl border border-neutral-800 hover:border-white rounded-xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:-translate-y-1 flex flex-col items-center text-center overflow-hidden cursor-pointer w-full">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-0 group-hover:opacity-100 group-hover:animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <ShieldAlert className="w-16 h-16 text-neutral-500 mb-6 group-hover:text-white group-hover:scale-110 transition-all duration-500 group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]" />
            <h2 className="text-3xl font-black text-white tracking-[0.2em] mb-2 z-10">BCSO</h2>
            <p className="text-neutral-500 text-xs mb-8 font-mono tracking-widest z-10">BLAINE COUNTY SHERIFF</p>
            <div className="mt-auto px-8 py-3 border border-neutral-700 bg-black text-neutral-400 text-[10px] rounded uppercase tracking-[0.3em] font-bold group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300 z-10 w-full">Initialiser</div>
          </button>

          {/* CARTE GLOBAL */}
          <button onClick={() => navigate('/map/GLOBAL')} className="group relative p-10 bg-[#050505]/80 backdrop-blur-xl border border-neutral-800 hover:border-white rounded-xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:-translate-y-1 flex flex-col items-center text-center overflow-hidden cursor-pointer w-full">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-0 group-hover:opacity-100 group-hover:animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] shadow-[0_0_10px_rgba(255,255,255,1)]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <Globe className="w-16 h-16 text-neutral-500 mb-6 group-hover:text-white group-hover:scale-110 transition-all duration-500 group-hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]" />
            <h2 className="text-3xl font-black text-white tracking-[0.2em] mb-2 z-10">GLOBAL</h2>
            <p className="text-neutral-500 text-xs mb-8 font-mono tracking-widest z-10">RÉSEAU INTER-SERVICES</p>
            <div className="mt-auto px-8 py-3 border border-neutral-700 bg-black text-neutral-400 text-[10px] rounded uppercase tracking-[0.3em] font-bold group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300 z-10 w-full">Connexion</div>
          </button>

        </div>

        {/* Indicateurs et Accès Admin (Nouveau bloc) */}
        <div className="mt-16 flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
            <span className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Système Opérationnel - En attente d'authentification</span>
          </div>
          
          {/* Apparaît uniquement pour l'administrateur */}
          {isAdmin && (
            <button 
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-800 rounded bg-black text-[10px] font-mono tracking-widest uppercase text-neutral-500 hover:text-white hover:border-white transition-all cursor-pointer"
            >
              <Lock className="w-3 h-3" /> Interface Supervision
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default Home;