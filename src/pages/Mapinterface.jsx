import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Radio, Target, Activity, Menu, X } from 'lucide-react';
import { io } from 'socket.io-client';
import SanAndreasMap from '../components/Map/SanAndreasMap';
import UnitManager from '../components/Tactical/UnitManager';
import DrawToolbar from '../components/Tactical/DrawToolbar';

const socket = io(window.location.origin.includes('localhost') ? 'http://localhost:3001' : window.location.origin);

const MapInterface = () => {
  const { faction } = useParams();
  const navigate = useNavigate();

  // ÉTATS DE BASE
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unitData, setUnitData] = useState({ callsign: '', agents: '', color: '#ffffff' });
  const [isDeployed, setIsDeployed] = useState(false);

  // ÉTATS TEMPS RÉEL (HUD & DESSIN)
  const [activeTool, setActiveTool] = useState('hand'); // 'hand' par défaut pour bouger
  const [strokeWidth, setStrokeWidth] = useState(3); // Épaisseur du trait par défaut
  const [activeUnitsList, setActiveUnitsList] = useState([]);
  const [zones, setZones] = useState([]);

  const factionLabel = faction ? faction.toUpperCase() : 'UNKNOWN';

  useEffect(() => {
    socket.on('sync_data', (data) => {
      setActiveUnitsList(data.units || []);
      setZones(data.zones || []);
    });

    socket.on('sync_units', (units) => setActiveUnitsList(units));
    socket.on('sync_zones', (updatedZones) => setZones(updatedZones));

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') {
        socket.emit('undo_last_zone');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      socket.off('sync_data');
      socket.off('sync_units');
      socket.off('sync_zones');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleDeploy = () => {
    if (unitData.callsign.trim() === '') return;
    setIsDeployed(true);
    setIsSidebarOpen(false);
    socket.emit('deploy_unit', unitData);
  };

  // NOUVEAU : Fonction pour quitter / supprimer son unité
  const handleLeaveUnit = () => {
    if (unitData.callsign) {
      socket.emit('delete_global_unit', unitData.callsign);
    }
    setIsDeployed(false);
    setUnitData({ callsign: '', agents: '', color: '#ffffff' });
  };

  const handleUndo = () => socket.emit('undo_last_zone');
  const handleClearAll = () => socket.emit('clear_all_zones');

  return (
    <div translate="no" className="w-screen h-screen flex flex-col bg-black text-slate-200 overflow-hidden select-none relative font-sans">
      
      {/* HEADER TACTIQUE */}
      <header className="absolute top-4 left-4 right-4 h-16 bg-[#050505]/80 backdrop-blur-xl z-[1000] flex items-center justify-between px-6 border border-neutral-800 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 border border-neutral-800 hover:border-white bg-black hover:bg-white hover:text-black rounded-lg transition-all duration-300 cursor-pointer group">
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </button>
          <div className="h-6 w-[1px] bg-neutral-800"></div>
          
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-white opacity-70 animate-pulse" />
            <h1 className="text-sm font-black tracking-[0.25em] text-white uppercase flex items-center gap-2">
              DISPATCH <span className="text-neutral-500 font-light">//</span> {factionLabel}
            </h1>
          </div>
        </div>

        {/* NOUVEAU : BARRE DES UNITÉS ACTIVES AU CENTRE */}
        <div className="flex-1 flex justify-center items-center gap-3 px-4 overflow-x-auto no-scrollbar">
          {activeUnitsList.map((u, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-700 bg-neutral-900/50" style={{ borderColor: `${u.color}40` }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: u.color, boxShadow: `0 0 8px ${u.color}` }}></div>
              <span className="text-xs font-bold tracking-wider" style={{ color: u.color }}>
                {u.callsign}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          {/* Bouton pour quitter si on est déployé */}
          {isDeployed && (
            <button onClick={handleLeaveUnit} className="flex items-center gap-1 px-3 py-1.5 bg-red-950/30 border border-red-900/50 text-red-500 hover:bg-red-900/50 hover:text-white rounded transition-colors cursor-pointer">
              <X className="w-3 h-3" />
              <span>10-7 (QUITTER)</span>
            </button>
          )}

          <div className="hidden md:block h-4 w-[1px] bg-neutral-800"></div>
          <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-2 bg-black px-4 py-2 border border-neutral-700 hover:border-white rounded-lg shadow-inner transition-colors group cursor-pointer">
            <Menu className="w-4 h-4 group-hover:text-white text-neutral-400" />
            <span className="text-neutral-400 group-hover:text-white tracking-widest font-bold text-[10px] uppercase">GÉRER UNITÉS</span>
          </button>
        </div>
      </header>

      <UnitManager 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        unitData={unitData}
        setUnitData={setUnitData}
        isDeployed={isDeployed}
        onDeploy={handleDeploy}
        activeUnitsList={activeUnitsList}
        onDeleteGlobalUnit={(callsign) => socket.emit('delete_global_unit', callsign)}
      />

      <DrawToolbar 
        activeColor={unitData.color} 
        isDeployed={isDeployed} 
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        onUndo={handleUndo}
        onClearAll={handleClearAll}
      />

      <SanAndreasMap 
        activeColor={unitData.color} 
        isDeployed={isDeployed}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        strokeWidth={strokeWidth}
        zones={zones}
        socket={socket}
      />

      <div className="absolute bottom-4 left-4 z-[1000] pointer-events-none font-mono text-[10px] text-neutral-600 tracking-widest uppercase">
        [SYS_OP: {isDeployed ? 'ACTIVE_TRACKING' : 'DISPATCH_READY'}]
      </div>
      <div className="absolute bottom-4 right-4 z-[1000] pointer-events-none font-mono text-[10px] text-neutral-600 tracking-widest uppercase flex items-center gap-2">
        <Activity className="w-3 h-3 animate-pulse" /> MAP_SYNC: ONLINE
      </div>
    </div>
  );
};

export default MapInterface;