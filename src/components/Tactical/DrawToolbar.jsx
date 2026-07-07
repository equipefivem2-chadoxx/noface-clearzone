import React from 'react';
import { Circle, Hexagon, Eraser, PenTool } from 'lucide-react';

const DrawToolbar = ({ activeColor, isDeployed }) => {
  // La barre n'apparaît que si ton unité est déployée
  if (!isDeployed) return null;

  return (
    <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-2 bg-[#050505]/95 backdrop-blur-2xl border border-neutral-800 p-2 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)]">
      
      {/* Indicateur de l'unité en cours */}
      <div className="px-4 border-r border-neutral-800 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_currentColor]" style={{ backgroundColor: activeColor, color: activeColor }}></div>
        <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">Clear Zone</span>
      </div>
      
      {/* Outils de dessin */}
      <button className="p-3 hover:bg-neutral-900 rounded-lg text-neutral-500 hover:text-white transition-colors" title="Tracé Libre">
        <PenTool className="w-4 h-4" />
      </button>
      <button className="p-3 hover:bg-neutral-900 rounded-lg text-neutral-500 hover:text-white transition-colors" title="Zone Circulaire">
        <Circle className="w-4 h-4" />
      </button>
      <button className="p-3 hover:bg-neutral-900 rounded-lg text-neutral-500 hover:text-white transition-colors" title="Périmètre (Polygone)">
        <Hexagon className="w-4 h-4" />
      </button>
      
      <div className="w-[1px] h-6 bg-neutral-800 mx-1"></div>
      
      <button className="p-3 hover:bg-red-950/50 hover:text-red-500 rounded-lg text-neutral-500 transition-colors" title="Gomme (Effacer zone)">
        <Eraser className="w-4 h-4" />
      </button>
    </div>
  );
};

export default DrawToolbar;