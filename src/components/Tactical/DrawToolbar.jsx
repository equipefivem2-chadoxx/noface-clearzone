import React from 'react';
import { Circle, Hexagon, Eraser, PenTool, Undo2, Trash2, Hand } from 'lucide-react';

const DrawToolbar = ({ activeColor, isDeployed, activeTool, setActiveTool, strokeWidth, setStrokeWidth, onUndo, onClearAll }) => {
  if (!isDeployed) return null;

  return (
    <div className="absolute top-24 left-6 z-[1000] flex flex-col items-center gap-2 bg-[#050505]/95 backdrop-blur-2xl border border-neutral-800 p-2 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)]">
      
      <div className="pb-4 border-b border-neutral-800 flex flex-col items-center gap-2 w-full">
        <div className="w-3 h-3 rounded-full animate-pulse shadow-[0_0_15px_currentColor]" style={{ backgroundColor: activeColor, color: activeColor }}></div>
      </div>
      
      {/* Outils de Navigation & Création */}
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
          title="Tracé Libre (Fluo)"
        >
          <PenTool className="w-4 h-4" />
        </button>
        {/* Slider affiché uniquement quand le Pen est actif */}
        {activeTool === 'pen' && (
          <div className="w-full pt-2 pb-1 px-1">
             <input type="range" min="2" max="25" value={strokeWidth} onChange={(e) => setStrokeWidth(Number(e.target.value))} className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white" title={`Épaisseur: ${strokeWidth}`} />
          </div>
        )}
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
      
      {/* Outils d'édition / suppression */}
      <button onClick={onUndo} className="p-3 rounded-lg transition-colors text-neutral-500 hover:text-white hover:bg-neutral-900" title="Annuler (Ctrl+Z)"><Undo2 className="w-4 h-4" /></button>
      <button onClick={() => setActiveTool('eraser')} className={`p-3 rounded-lg transition-colors ${activeTool === 'eraser' ? 'bg-red-500 text-black' : 'text-neutral-500 hover:bg-red-950/50 hover:text-red-500'}`} title="Gomme (Effacer au clic)"><Eraser className="w-4 h-4" /></button>
      <button onClick={onClearAll} className="p-3 mt-1 rounded-lg transition-colors text-neutral-500 hover:bg-red-900/80 hover:text-white" title="Tout effacer"><Trash2 className="w-4 h-4" /></button>
    </div>
  );
};

export default DrawToolbar;