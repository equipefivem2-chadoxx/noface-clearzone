import React from 'react';
import { Shield, ShieldAlert, Globe, Crosshair } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center p-4 relative overflow-hidden select-none">
      
      {/* Effets de lumière en arrière-plan */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Conteneur principal */}
      <div className="max-w-6xl w-full z-10 flex flex-col items-center">
        
        {/* En-tête du centre opérationnel */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Crosshair className="w-12 h-12 text-blue-500 opacity-80 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 drop-shadow-lg">
              TACTICAL <span className="text-blue-500">COMMAND</span>
            </h1>
          </div>
          <p className="text-slate-400 tracking-[0.3em] font-mono text-sm md:text-base">
            SYSTÈME DE GESTION DES OPÉRATIONS - SAN ANDREAS
          </p>
        </div>

        {/* Sélection des services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-4">
          
          {/* LSPD */}
          <button className="group relative p-10 bg-slate-900/40 backdrop-blur-md border border-slate-800 hover:border-blue-500/50 rounded-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Shield className="w-20 h-20 text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            <h2 className="text-3xl font-bold text-slate-100 tracking-wider mb-2">LSPD</h2>
            <p className="text-slate-400 text-sm mb-8 font-medium">Los Santos Police Department</p>
            <div className="mt-auto px-6 py-2 border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs rounded-full uppercase tracking-widest font-bold group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
              Connexion Unité
            </div>
          </button>

          {/* BCSO */}
          <button className="group relative p-10 bg-slate-900/40 backdrop-blur-md border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <ShieldAlert className="w-20 h-20 text-amber-500 mb-6 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
            <h2 className="text-3xl font-bold text-slate-100 tracking-wider mb-2">BCSO</h2>
            <p className="text-slate-400 text-sm mb-8 font-medium">Blaine County Sheriff Office</p>
            <div className="mt-auto px-6 py-2 border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs rounded-full uppercase tracking-widest font-bold group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
              Connexion Unité
            </div>
          </button>

          {/* GLOBAL */}
          <button className="group relative p-10 bg-slate-900/40 backdrop-blur-md border border-slate-800 hover:border-slate-300/50 rounded-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(203,213,225,0.1)] hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Globe className="w-20 h-20 text-slate-300 mb-6 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_15px_rgba(203,213,225,0.3)]" />
            <h2 className="text-3xl font-bold text-slate-100 tracking-wider mb-2">GLOBAL</h2>
            <p className="text-slate-400 text-sm mb-8 font-medium">Inter-Services</p>
            <div className="mt-auto px-6 py-2 border border-slate-500/30 bg-slate-500/10 text-slate-300 text-xs rounded-full uppercase tracking-widest font-bold group-hover:bg-slate-200 group-hover:text-slate-900 transition-colors duration-300">
              Connexion Inter-Services
            </div>
          </button>

        </div>
      </div>
    </div>
  );
}

export default App;