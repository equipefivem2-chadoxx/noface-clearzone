import React, { useState, useEffect } from 'react';
import { X, Crosshair, Users, Activity, Fingerprint, Plus, LogIn, Radio, Trash2 } from 'lucide-react';

const UnitManager = ({ isOpen, onClose, unitData, setUnitData, isDeployed, onDeploy, activeUnitsList = [], onDeleteGlobalUnit }) => {
  const [activeTab, setActiveTab] = useState('create');

  useEffect(() => {
    if (!unitData.color || unitData.color === '#ffffff') {
      const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      setUnitData(prev => ({ ...prev, color: randomColor }));
    }
  }, []);

  const handleJoinUnit = (unit) => {
    // Fusionne directement l'unité et la déploie
    setUnitData({ callsign: unit.callsign, agents: unit.agents, color: unit.color });
    setTimeout(() => onDeploy(), 100); 
  };

  return (
    <div className={`absolute top-0 right-0 h-full w-[400px] bg-[#030303]/95 backdrop-blur-3xl border-l border-neutral-800/50 z-[1050] flex flex-col shadow-[-30px_0_50px_rgba(0,0,0,0.9)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
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

        {/* ONGLETS */}
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('create')} className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-widest uppercase transition-all border-b-2 ${activeTab === 'create' ? 'border-white text-white bg-white/5' : 'border-transparent text-neutral-600 hover:text-neutral-400'}`}>
            <Plus className="w-3 h-3" /> Créer
          </button>
          <button onClick={() => setActiveTab('join')} className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-widest uppercase transition-all border-b-2 ${activeTab === 'join' ? 'border-white text-white bg-white/5' : 'border-transparent text-neutral-600 hover:text-neutral-400'}`}>
            <LogIn className="w-3 h-3" /> Rejoindre
          </button>
        </div>
      </div>

      {/* Corps du formulaire */}
      <div className="flex-1 p-6 overflow-y-auto space-y-8">
        {activeTab === 'create' ? (
          <>
            <div className="space-y-3 group">
              <label className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase flex items-center gap-2">
                <Crosshair className="w-3 h-3 group-hover:text-white transition-colors" /> Indicatif Opérationnel
              </label>
              <div className="flex bg-[#0a0a0a] border border-neutral-800 rounded focus-within:border-neutral-500 overflow-hidden transition-all">
                <div className="flex items-center justify-center px-4 bg-neutral-900/50 border-r border-neutral-800 text-neutral-500 font-mono text-xs">[ID]</div>
                <input type="text" placeholder="LINCOLN-4" value={unitData.callsign} onChange={(e) => setUnitData({...unitData, callsign: e.target.value.toUpperCase()})} className="w-full bg-transparent px-4 py-3 text-white font-mono tracking-wider outline-none placeholder:text-neutral-700" />
              </div>
            </div>
            <div className="space-y-3 group">
              <label className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase flex items-center gap-2">
                <Users className="w-3 h-3 group-hover:text-white transition-colors" /> Effectif Déployé
              </label>
              <textarea placeholder="Noms des officiers..." rows="2" value={unitData.agents} onChange={(e) => setUnitData({...unitData, agents: e.target.value})} className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-neutral-500 rounded px-4 py-3 text-white font-mono tracking-wider outline-none transition-all placeholder:text-neutral-700 resize-none" />
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase">Unités sur le terrain ({activeUnitsList.length})</h3>
            {activeUnitsList.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-10 text-neutral-600 font-mono text-xs text-center space-y-4">
                 <Radio className="w-8 h-8 opacity-50" />
                 <p>AUCUNE UNITÉ ACTIVE</p>
               </div>
            ) : (
              <div className="space-y-2">
                {activeUnitsList.map((unit, index) => (
                  <div key={index} className="p-4 bg-[#0a0a0a] border border-neutral-800 rounded flex items-center justify-between group hover:border-neutral-500 transition-colors cursor-pointer" onClick={() => handleJoinUnit(unit)}>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: unit.color, color: unit.color }}></div>
                      <div>
                        <div className="text-white font-mono font-bold tracking-wider text-sm">{unit.callsign}</div>
                        <div className="text-neutral-500 font-mono text-[9px] tracking-widest">{unit.agents || "Aucun agent listé"}</div>
                      </div>
                    </div>
                    
                    {/* NOUVEAU : Actions (Supprimer et Rejoindre) */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Empêche de déclencher handleJoinUnit
                          if (onDeleteGlobalUnit) onDeleteGlobalUnit(unit.callsign);
                        }}
                        className="p-2 text-neutral-600 hover:text-red-500 hover:bg-red-950/30 rounded transition-colors"
                        title="Supprimer l'unité pour tout le monde"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <LogIn className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" title="Rejoindre" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bouton d'action (visible uniquement dans "Créer" ou si déjà déployé) */}
      {(activeTab === 'create' || isDeployed) && (
        <div className="p-6 border-t border-neutral-900 bg-[#020202]">
          <button onClick={onDeploy} disabled={!unitData.callsign} className="relative w-full py-4 rounded overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500" style={{ backgroundColor: unitData.callsign ? `${unitData.color}15` : '#111', border: `1px solid ${unitData.callsign ? unitData.color : '#333'}`, color: unitData.callsign ? unitData.color : '#666' }}>
            {unitData.callsign && <div className="absolute inset-0 opacity-20 pointer-events-none transition-transform duration-700 group-hover:scale-150" style={{ background: `radial-gradient(circle at center, ${unitData.color} 0%, transparent 70%)` }}></div>}
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