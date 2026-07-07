import React, { useState, useEffect } from 'react';
import { X, Crosshair, Users, Activity, Fingerprint, Plus, LogIn } from 'lucide-react';

const UnitManager = ({ isOpen, onClose, unitData, setUnitData, isDeployed, onDeploy }) => {
  const [activeTab, setActiveTab] = useState('create');

  // Génération d'une couleur aléatoire unique au chargement
  useEffect(() => {
    if (!unitData.color || unitData.color === '#ffffff') {
      const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      setUnitData(prev => ({ ...prev, color: randomColor }));
    }
  }, []);

  return (
    <div 
      className={`absolute top-0 right-0 h-full w-[400px] bg-[#030303]/95 backdrop-blur-3xl border-l border-neutral-800/50 z-[1050] flex flex-col shadow-[-30px_0_50px_rgba(0,0,0,0.9)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* En-tête industriel */}
      <div className="p-6 border-b border-neutral-900 bg-black/40 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-30"></div>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black tracking-[0.2em] text-white uppercase">Terminal Unité</h2>
            <p className="text-[9px] font-mono text-neutral-500 tracking-widest flex items-center gap-2">
              ID RÉSEAU : <span style={{ color: unitData.color }}>{unitData.color.toUpperCase()}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-900 rounded transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ONGLETS (CRÉER / REJOINDRE) */}
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('create')} 
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-widest uppercase transition-all border-b-2 ${activeTab === 'create' ? 'border-white text-white bg-white/5' : 'border-transparent text-neutral-600 hover:text-neutral-400'}`}
          >
            <Plus className="w-3 h-3" /> Créer
          </button>
          <button 
            onClick={() => setActiveTab('join')} 
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-widest uppercase transition-all border-b-2 ${activeTab === 'join' ? 'border-white text-white bg-white/5' : 'border-transparent text-neutral-600 hover:text-neutral-400'}`}
          >
            <LogIn className="w-3 h-3" /> Rejoindre
          </button>
        </div>
      </div>

      {/* Corps du formulaire (Mode Création) */}
      <div className="flex-1 p-6 overflow-y-auto space-y-8">
        {activeTab === 'create' ? (
          <>
            {/* Module Indicatif (BUG CORRIGÉ ICI) */}
            <div className="space-y-3 group">
              <label className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase flex items-center gap-2">
                <Crosshair className="w-3 h-3 group-hover:text-white transition-colors" /> Indicatif Opérationnel
              </label>
              
              <div className="flex bg-[#0a0a0a] border border-neutral-800 rounded focus-within:border-neutral-500 overflow-hidden transition-all">
                <div className="flex items-center justify-center px-4 bg-neutral-900/50 border-r border-neutral-800 text-neutral-500 font-mono text-xs">
                  [ID]
                </div>
                <input 
                  type="text" 
                  placeholder="LINCOLN-4" 
                  value={unitData.callsign}
                  onChange={(e) => setUnitData({...unitData, callsign: e.target.value.toUpperCase()})}
                  className="w-full bg-transparent px-4 py-3 text-white font-mono tracking-wider outline-none placeholder:text-neutral-700"
                />
              </div>
            </div>

            {/* Module Agents */}
            <div className="space-y-3 group">
              <label className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase flex items-center gap-2">
                <Users className="w-3 h-3 group-hover:text-white transition-colors" /> Effectif Déployé
              </label>
              <textarea 
                placeholder="Noms des officiers..." 
                rows="2"
                value={unitData.agents}
                onChange={(e) => setUnitData({...unitData, agents: e.target.value})}
                className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-neutral-500 rounded px-4 py-3 text-white font-mono tracking-wider outline-none transition-all placeholder:text-neutral-700 resize-none"
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-neutral-600 font-mono text-xs text-center space-y-4">
            <Activity className="w-8 h-8 opacity-50" />
            <p>RECHERCHE D'UNITÉS ACTIVES...</p>
            <p className="text-[9px]">Le module de synchronisation sera bientôt en ligne.</p>
          </div>
        )}
      </div>

      {/* Pied du panneau */}
      {activeTab === 'create' && (
        <div className="p-6 border-t border-neutral-900 bg-[#020202]">
          <button 
            onClick={onDeploy}
            disabled={!unitData.callsign}
            className="relative w-full py-4 rounded overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500"
            style={{
              backgroundColor: unitData.callsign ? `${unitData.color}15` : '#111',
              border: `1px solid ${unitData.callsign ? unitData.color : '#333'}`,
              color: unitData.callsign ? unitData.color : '#666'
            }}
          >
            {unitData.callsign && (
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none transition-transform duration-700 group-hover:scale-150"
                style={{ background: `radial-gradient(circle at center, ${unitData.color} 0%, transparent 70%)` }}
              ></div>
            )}
            <span className="relative z-10 font-mono text-sm tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-3">
              {isDeployed ? <Activity className="w-4 h-4 animate-pulse" /> : <Fingerprint className="w-4 h-4" />}
              {isDeployed ? 'Mettre à jour' : 'Initialiser Unité'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UnitManager;