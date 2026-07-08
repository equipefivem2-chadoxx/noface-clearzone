import React, { useState, useEffect } from 'react';
import { X, Crosshair, Users, Activity, Fingerprint, Plus, LogIn, Radio, Trash2 } from 'lucide-react';

const UnitManager = ({ isOpen, onClose, unitData, setUnitData, isDeployed, onDeploy, activeUnitsList = [], factionLabel, onDeleteGlobalUnit }) => {
  const [activeTab, setActiveTab] = useState('create');

  useEffect(() => {
    if (!unitData.color || unitData.color === '#ffffff') {
      const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      setUnitData(prev => ({ ...prev, color: randomColor }));
    }
  }, []);

  const handleJoinUnit = (unit) => {
    // Te connecte à l'unité en direct (vous partagez désormais le même callsign)
    onDeploy(unit);
    setActiveTab('create'); // Ramène sur l'onglet Création pour que tu puisses t'ajouter aux agents
  };

  return (
    <div className={`absolute top-0 right-0 h-full w-[400px] bg-[#030303]/95 backdrop-blur-3xl border-l border-neutral-800/50 z-[1050] flex flex-col shadow-[-30px_0_50px_rgba(0,0,0,0.9)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
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

        <div className="flex gap-2">
          <button onClick={() => setActiveTab('create')} className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-widest uppercase transition-all border-b-2 ${activeTab === 'create' ? 'border-white text-white bg-white/5' : 'border-transparent text-neutral-600 hover:text-neutral-400'}`}>
            <Plus className="w-3 h-3" /> {isDeployed ? "Modifier" : "Créer"}
          </button>
          <button onClick={() => setActiveTab('join')} className={`flex-1 py-3 flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-widest uppercase transition-all border-b-2 ${activeTab === 'join' ? 'border-white text-white bg-white/5' : 'border-transparent text-neutral-600 hover:text-neutral-400'}`}>
            <LogIn className="w-3 h-3" /> Rejoindre
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-8">
        {activeTab === 'create' ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Indicatif Unité (Fixe en OP)</label>
              <div className="flex items-center bg-black border border-neutral-800 focus-within:border-white rounded px-3 transition-colors">
                <Radio className="w-4 h-4 text-neutral-600 mr-3" />
                <input disabled={isDeployed} type="text" value={unitData.callsign} onChange={e => setUnitData(p => ({ ...p, callsign: e.target.value }))} className={`w-full bg-transparent py-3 text-sm text-white font-mono uppercase focus:outline-none ${isDeployed ? 'opacity-50 cursor-not-allowed' : 'placeholder-neutral-700'}`} placeholder="Ex: LINCOLN-10" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Agents Matricules (Modifiable)</label>
              <div className="flex items-center bg-black border border-neutral-800 focus-within:border-white rounded px-3 transition-colors">
                <Users className="w-4 h-4 text-neutral-600 mr-3" />
                {/* Le champ Agent n'est PLUS désactivé quand déployé */}
                <input type="text" value={unitData.agents} onChange={e => setUnitData(p => ({ ...p, agents: e.target.value }))} className="w-full bg-transparent py-3 text-sm text-white font-mono uppercase focus:outline-none placeholder-neutral-700" placeholder="Ex: 01 | 43 | 12" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Couleur d'identification</label>
              <div className="flex items-center gap-4 bg-black border border-neutral-800 p-3 rounded">
                {/* Couleur modifiable en direct aussi */}
                <input type="color" value={unitData.color} onChange={e => setUnitData(p => ({ ...p, color: e.target.value }))} className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer" />
                <span className="text-xs font-mono text-neutral-400">{unitData.color.toUpperCase()}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeUnitsList.length === 0 ? (
              <div className="h-32 flex flex-col items-center justify-center text-neutral-600 border border-dashed border-neutral-900 rounded-lg">
                <Fingerprint className="w-6 h-6 mb-2 opacity-40" />
                <span className="text-[10px] font-mono tracking-wider uppercase">Aucun module actif enregistré</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {activeUnitsList.map((unit) => (
                  <div key={unit.callsign} className="group flex items-center justify-between p-4 bg-neutral-950 border border-neutral-900 rounded-lg hover:border-neutral-700 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: unit.color }}></div>
                      <div>
                        <h4 className="text-xs font-mono font-bold text-white uppercase">{unit.callsign}</h4>
                        <p className="text-[10px] font-mono text-neutral-500">AGENTS: {unit.agents}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onDeleteGlobalUnit(unit.callsign)} className="p-2 hover:bg-red-950/40 border border-transparent hover:border-red-900/50 rounded transition-colors" title="Supprimer définitivement">
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                      <button onClick={() => handleJoinUnit(unit)} className="p-2 hover:bg-neutral-900 border border-transparent hover:border-neutral-800 rounded transition-colors" title="Rejoindre l'unité">
                        <LogIn className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {(activeTab === 'create' || isDeployed) && (
        <div className="p-6 border-t border-neutral-900 bg-[#020202]">
          <button onClick={() => onDeploy(null)} disabled={!unitData.callsign || isDeployed} className="relative w-full py-4 rounded overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500" style={{ backgroundColor: unitData.callsign ? `${unitData.color}15` : '#111', border: `1px solid ${unitData.callsign ? unitData.color : '#333'}`, color: unitData.callsign ? unitData.color : '#666' }}>
            {unitData.callsign && <div className="absolute inset-0 opacity-20 pointer-events-none transition-transform duration-700 group-hover:scale-150" style={{ background: `radial-gradient(circle at center, ${unitData.color} 0%, transparent 70%)` }}></div>}
            <span className="relative z-10 font-mono text-sm tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-3">
              {isDeployed ? <Activity className="w-4 h-4 animate-pulse" /> : <Fingerprint className="w-4 h-4" />}
              {isDeployed ? "Module Déployé (Synchro Auto)" : "Initialiser Module"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UnitManager;