import React from 'react';
import { Circle, Hexagon, Eraser, PenTool, Undo2, Hand } from 'lucide-react';

const DrawToolbar = ({ activeColor, isDeployed, activeTool, setActiveTool, strokeWidth, setStrokeWidth, onUndo }) => {
  if (!isDeployed) return null;

  const btnBase = "p-3 rounded-full transition-all duration-300 flex items-center justify-center relative group";
  const btnActive = "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-110";
  const btnInactive = "text-white/60 hover:text-white hover:bg-white/10 hover:scale-105";

  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-6 z-[1000] flex flex-col items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/10 p-3 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.5)]">
      
      {/* Indicateur de couleur */}
      <div className="mb-2 p-1">
        <div 
          className="w-4 h-4 rounded-full animate-pulse ring-2 ring-white/20" 
          style={{ backgroundColor: activeColor, boxShadow: `0 0 15px ${activeColor}` }}
        ></div>
      </div>
      
      <button onClick={() => setActiveTool('hand')} className={`${btnBase} ${activeTool === 'hand' ? btnActive : btnInactive}`} title="Main (Navigation libre)">
        <Hand className="w-5 h-5" />
      </button>

      <div className="relative flex flex-col items-center">
        <button onClick={() => setActiveTool('pen')} className={`${btnBase} ${activeTool === 'pen' ? btnActive : btnInactive}`} title="Crayon Tactique">
          <PenTool className="w-5 h-5" />
        </button>
        {activeTool === 'pen' && (
          <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
            <span className="text-[10px] text-white/50 font-mono">Taille</span>
            <input type="range" min="1" max="15" value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white" />
          </div>
        )}
      </div>

      <button onClick={() => setActiveTool('circle')} className={`${btnBase} ${activeTool === 'circle' ? btnActive : btnInactive}`} title="Zone Circulaire">
        <Circle className="w-5 h-5" />
      </button>
      
      <button onClick={() => setActiveTool('polygon')} className={`${btnBase} ${activeTool === 'polygon' ? btnActive : btnInactive}`} title="Périmètre (Polygone)">
        <Hexagon className="w-5 h-5" />
      </button>
      
      <div className="h-[1px] w-8 bg-white/10 my-2"></div>
      
      <button onClick={onUndo} className={`${btnBase} ${btnInactive}`} title="Annuler (Ctrl+Z)">
        <Undo2 className="w-5 h-5" />
      </button>
      
      <button onClick={() => setActiveTool('eraser')} className={`${btnBase} ${activeTool === 'eraser' ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] scale-110' : 'text-white/60 hover:text-red-400 hover:bg-red-500/20 hover:scale-105'}`} title="Gomme / Supprimer">
        <Eraser className="w-5 h-5" />
      </button>
    </div>
  );
};

export default DrawToolbar;