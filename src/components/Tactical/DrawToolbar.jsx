import React from 'react';
import { Circle, Hexagon, Eraser, PenTool, Undo2, Trash2, Hand } from 'lucide-react';

const DrawToolbar = ({ activeColor, isDeployed, activeTool, setActiveTool, strokeWidth, setStrokeWidth, onUndo, onClearAll }) => {
  if (!isDeployed) return null;

  return (
    <div className="absolute top-24 left-6 z-[1000] flex flex-col items-center gap-2 bg-[#050505]/95 backdrop-blur-2xl border border-neutral-800 p-2 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)]">
      
      <div className="pb-4 border-b border-neutral-800 flex flex-col items-center gap-2 w-full">
        <div className="w-3 h-3 rounded-full animate-pulse shadow-[0_0_15px_currentColor]" style={{ backgroundColor: activeColor, color: activeColor }}></div>
      </div>
      
      <button 
        onClick={() => setActiveTool('hand')}
        className={`p-3 rounded-lg transition-colors ${activeTool === 'hand' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'}`} 
        title="Main (Navigation libre)"
      >
        <Hand className="w-4 h-4" />
      </button>

      <div className="relative group w-full flex flex-col items-center">
        <button 
          onClick={() => setActiveTool('pen')}
          className={`p-3 w-full flex justify-center rounded-lg transition-colors ${activeTool === 'pen' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'}`} 
          title="Crayon Tactique"
        >
          <PenTool className="w-4 h-4" />
        </button>
      </div>

      <button 
        onClick={() => setActiveTool('circle')}
        className={`p-3 rounded-lg transition-colors ${activeTool === 'circle' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'}`} 
        title="Zone Circulaire"
      >
        <Circle className="w-4 h-4" />
      </button>
      
      <button 
        onClick={() => setActiveTool('polygon')}
        className={`p-3 rounded-lg transition-colors ${activeTool === 'polygon' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'}`} 
        title="Périmètre (Polygone)"
      >
        <Hexagon className="w-4 h-4" />
      </button>
      
      <div className="h-[1px] w-6 bg-neutral-800 my-1"></div>
      
      <button onClick={onUndo} className="p-3 rounded-lg transition-colors text-neutral-500 hover:text-white hover:bg-neutral-900" title="Annuler (Ctrl+Z)">
        <Undo2 className="w-4 h-4" />
      </button>
      
      <button 
        onClick={() => setActiveTool('eraser')} 
        className={`p-3 rounded-lg transition-colors ${activeTool === 'eraser' ? 'bg-red-500 text-black' : 'text-neutral-500 hover:bg-red-900/20 hover:text-red-500'}`} 
        title="Gomme de zone"
      >
        <Eraser className="w-4 h-4" />
      </button>

      {/* BOUTON RAJOUTÉ : EFFACER TOUT D'UN COUP AVEC DEMANDE DE SÉCURITÉ */}
      <button 
        onClick={() => {
          if (window.confirm("🔴 ATTENTION : Voulez-vous effacer TOUS les tracés tactiques de cette carte ?")) {
            onClearAll();
          }
        }} 
        className="p-3 rounded-lg transition-colors text-neutral-500 hover:bg-red-600 hover:text-white" 
        title="TOUT EFFACER (WIPE MAP)"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default DrawToolbar;