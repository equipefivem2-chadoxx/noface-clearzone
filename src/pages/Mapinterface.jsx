import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Radio, Target, Activity, Menu, X, Crosshair, Users } from 'lucide-react';
import SanAndreasMap from '../components/Map/SanAndreasMap';

const MapInterface = () => {
  const { faction } = useParams();
  const navigate = useNavigate();

  // ÉTATS DU PANNEAU TACTIQUE
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unitData, setUnitData] = useState({
    callsign: '',
    agents: '',
    color: '#ffffff' // Blanc par défaut
  });
  const [isDeployed, setIsDeployed] = useState(false);

  const factionLabel = faction ? faction.toUpperCase() : 'UNKNOWN';

  // Couleurs tactiques disponibles
  const tacticalColors = [
    { name: 'Blanc Standard', hex: '#ffffff' },
    { name: 'Bleu LSPD', hex: '#3b82f6' },
    { name: 'Ambre BCSO', hex: '#f59e0b' },
    { name: 'Vert IR', hex: '#22c55e' },
    { name: 'Rouge Assaut', hex: '#ef4444' }
  ];

  const handleDeploy = () => {
    if (unitData.callsign.trim() === '') return;
    setIsDeployed(true);
    setIsSidebarOpen(false);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-black text-slate-200 overflow-hidden select-none relative font-sans">
      
      {/* HEADER TACTIQUE */}
      <header className="absolute top-4 left-4 right-4 h-16 bg-[#050505]/80 backdrop-blur-xl z-[1000] flex items-center justify-between px-6 border border-neutral-800 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        
        {/* Navigation & Titre */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 border border-neutral-800 hover:border-white bg-black hover:bg-white hover:text-black rounded-lg transition-all duration-300 cursor-pointer group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </button>
          <div className="h-6 w-[1px] bg-neutral-800"></div>
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-white opacity-70 animate-pulse" />
            <h1 className="text-sm font-black tracking-[0.25em] text-white uppercase flex items-center gap-2">
              RESEAU TACTIQUE <span className="text-neutral-500 font-light">//</span> {factionLabel}
              {isDeployed && (
                <>
                  <span className="text-neutral-500 font-light">//</span>
                  <span style={{ color: unitData.color }}>[{unitData.callsign}]</span>
                </>
              )}
            </h1>
          </div>
        </div>

        {/* Télémétrie & Bouton Panneau */}
        <div className="flex items-center gap-6 font-mono text-xs">
          <div className="hidden md:flex items-center gap-2 text-neutral-500 tracking-wider">
            <Radio className="w-4 h-4 text-neutral-400" />
            <span>NET_CH: <span className="text-white font-bold">SEC_0{factionLabel === 'GLOBAL' ? '0' : '1'}</span></span>
          </div>
          <div className="hidden md:block h-4 w-[1px] bg-neutral-800"></div>
          
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 bg-black px-4 py-2 border border-neutral-700 hover:border-white rounded-lg shadow-inner transition-colors group cursor-pointer"
          >
            <Menu className="w-4 h-4 group-hover:text-white text-neutral-400" />
            <span className="text-neutral-400 group-hover:text-white tracking-widest font-bold text-[10px] uppercase">
              UNITÉS
            </span>
          </button>
        </div>
      </header>

      {/* PANNEAU LATÉRAL DE CONFIGURATION (SIDEBAR) */}
      <div className={`absolute top-0 right-0 h-full w-96 bg-[#050505]/95 backdrop-blur-2xl border-l border-neutral-800 z-[1050] p-6 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* En-tête Sidebar */}
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-neutral-800">
          <h2 className="text-xl font-black tracking-[0.2em] text-white uppercase">
            Création d'Unité
          </h2>
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white hover:text-black rounded border border-transparent hover:border-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <div className="space-y-8">
          
          {/* Indicatif */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase flex items-center gap-2">
              <Crosshair className="w-3 h-3" /> Indicatif Unité
            </label>
            <input 
              type="text" 
              placeholder="Ex: LINCOLN-4" 
              value={unitData.callsign}
              onChange={(e) => setUnitData({...unitData, callsign: e.target.value.toUpperCase()})}
              className="w-full bg-black border border-neutral-800 focus:border-white rounded-lg px-4 py-3 text-white font-mono tracking-wider outline-none transition-all placeholder:text-neutral-700"
            />
          </div>

          {/* Agents */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase flex items-center gap-2">
              <Users className="w-3 h-3" /> Agents Déployés
            </label>
            <input 
              type="text" 
              placeholder="Ex: J. Doe, R. Smith" 
              value={unitData.agents}
              onChange={(e) => setUnitData({...unitData, agents: e.target.value})}
              className="w-full bg-black border border-neutral-800 focus:border-white rounded-lg px-4 py-3 text-white font-mono tracking-wider outline-none transition-all placeholder:text-neutral-700"
            />
          </div>

          {/* Signature Tactique (Couleurs) */}
          <div className="space-y-3">
            <label className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">
              Signature Tactique
            </label>
            <div className="flex flex-wrap gap-3">
              {tacticalColors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setUnitData({...unitData, color: color.hex})}
                  className={`w-10 h-10 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-center ${unitData.color === color.hex ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-transparent hover:border-neutral-600'}`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {unitData.color === color.hex && <div className="w-3 h-3 bg-black rounded-full"></div>}
                </button>
              ))}
            </div>
          </div>

          {/* Bouton Déploiement */}
          <button 
            onClick={handleDeploy}
            disabled={!unitData.callsign}
            className={`w-full mt-8 py-4 rounded font-mono text-sm tracking-[0.2em] uppercase font-bold transition-all duration-300 border ${unitData.callsign ? 'bg-white text-black border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'bg-black text-neutral-600 border-neutral-800 cursor-not-allowed'}`}
          >
            {isDeployed ? 'Mettre à jour' : 'Déployer Unité'}
          </button>

        </div>
      </div>

      {/* COMPOSANT CARTE (On lui passe la couleur active pour dessiner plus tard) */}
      <SanAndreasMap activeColor={unitData.color} isDeployed={isDeployed} />

      {/* FILTRES D'ÉCRAN */}
      <div className="absolute bottom-4 left-4 z-[1000] pointer-events-none font-mono text-[10px] text-neutral-600 tracking-widest uppercase">
        [SYS_OP: {isDeployed ? 'ACTIVE_TRACKING' : 'DISPATCH_READY'}]
      </div>
      <div className="absolute bottom-4 right-4 z-[1000] pointer-events-none font-mono text-[10px] text-neutral-600 tracking-widest uppercase flex items-center gap-2">
        <Activity className="w-3 h-3 animate-pulse" /> GRID_SCALE: 1:1
      </div>

    </div>
  );
};

export default MapInterface;