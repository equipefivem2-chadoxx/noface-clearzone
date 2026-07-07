import React from 'react';
import { X, Crosshair, Users, ShieldAlert, Terminal, Activity } from 'lucide-react';

const UnitManager = ({ isOpen, onClose, unitData, setUnitData, isDeployed, onDeploy }) => {
  const tacticalColors = [
    { name: 'GHOST (Blanc)', hex: '#ffffff' },
    { name: 'LSPD (Bleu)', hex: '#3b82f6' },
    { name: 'BCSO (Ambre)', hex: '#f59e0b' },
    { name: 'SWAT (Rouge)', hex: '#ef4444' },
    { name: 'K9 (Vert)', hex: '#22c55e' },
    { name: 'FIB (Violet)', hex: '#a855f7' }
  ];

  return (
    <div 
      className={`absolute top-0 right-0 h-full w-[400px] bg-[#030303]/95 backdrop-blur-3xl border-l border-neutral-800/50 z-[1050] flex flex-col shadow-[-30px_0_50px_rgba(0,0,0,0.9)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* En-tête industriel */}
      <div className="p-6 border-b border-neutral-900 bg-black/40 flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-30"></div>
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-neutral-400" />
          <div>
            <h2 className="text-lg font-black tracking-[0.2em] text-white uppercase">Gestion Unité</h2>
            <p className="text-[9px] font-mono text-neutral-500 tracking-widest">CONFIGURATION TACTIQUE</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-900 rounded transition-all">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Corps du formulaire */}
      <div className="flex-1 p-6 overflow-y-auto space-y-8">
        
        {/* Module Indicatif */}
        <div className="space-y-3 group">
          <label className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase flex items-center gap-2">
            <Crosshair className="w-3 h-3 group-hover:text-white transition-colors" /> Indicatif Opérationnel
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-neutral-600 font-mono text-sm">[ID]</span>
            </div>
            <input 
              type="text" 
              placeholder="LINCOLN-4" 
              value={unitData.callsign}
              onChange={(e) => setUnitData({...unitData, callsign: e.target.value.toUpperCase()})}
              className="w-full bg-[#0a0a0a] border border-neutral-800 focus:border-neutral-500 rounded px-4 py-3 pl-12 text-white font-mono tracking-wider outline-none transition-all placeholder:text-neutral-700"
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

        {/* Module Couleur (Signature Tactique) */}
        <div className="space-y-4">
          <label className="text-[10px] font-mono tracking-[0.3em] text-neutral-500 uppercase flex items-center gap-2">
            <ShieldAlert className="w-3 h-3" /> Signature Visuelle
          </label>
          <div className="grid grid-cols-2 gap-3">
            {tacticalColors.map((color) => (
              <button
                key={color.hex}
                onClick={() => setUnitData({...unitData, color: color.hex})}
                className={`flex items-center gap-3 p-3 rounded border transition-all duration-300 ${
                  unitData.color === color.hex 
                    ? 'bg-[#111] border-neutral-400' 
                    : 'bg-black border-neutral-900 hover:border-neutral-700'
                }`}
                style={{
                  boxShadow: unitData.color === color.hex ? `0 0 15px ${color.hex}20, inset 0 0 10px ${color.hex}10` : 'none',
                  borderColor: unitData.color === color.hex ? color.hex : ''
                }}
              >
                <div 
                  className="w-4 h-4 rounded-full border border-black" 
                  style={{ backgroundColor: color.hex, boxShadow: `0 0 10px ${color.hex}` }}
                ></div>
                <span className="text-xs font-mono text-neutral-300 tracking-wider">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Pied du panneau (Déploiement) */}
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
    </div>
  );
};

export default UnitManager;