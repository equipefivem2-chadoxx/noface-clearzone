import React from 'react';
import { Circle, Hexagon, Eraser, PenTool } from 'lucide-react';

const DrawToolbar = ({ activeColor, isDeployed, activeTool, setActiveTool }) => {
  if (!isDeployed) return null;

  return (
    <div className="absolute top-24 left-6 z-[1000] flex flex-col items-center gap-2 bg-[#050505]/95 backdrop-blur-2xl border border-neutral-800 p-2 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)]">
      
      {/* Indicateur de l'unité */}
      <div className="pb-4 border-b border-neutral-800 flex flex-col items-center gap-2 w-full">
        <div className="w-3 h-3 rounded-full animate-pulse shadow-[0_0_15px_currentColor]" style={{ backgroundColor: activeColor, color: activeColor }}></div>
      </div>
      
      {/* Outils de dessin (avec état actif) */}
      <button 
        onClick={() => setActiveTool('draw')}
        className={`p-3 rounded-lg transition-colors ${activeTool === 'draw' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'}`} 
        title="Tracé Libre"
      >
        <PenTool className="w-4 h-4" />
      </button>
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
      
      <button 
        onClick={() => setActiveTool('eraser')}
        className={`p-3 rounded-lg transition-colors ${activeTool === 'eraser' ? 'bg-red-500 text-black' : 'text-neutral-500 hover:bg-red-950/50 hover:text-red-500'}`} 
        title="Gomme (Effacer zone)"
      >
        <Eraser className="w-4 h-4" />
      </button>
    </div>
  );
};

export default DrawToolbar;