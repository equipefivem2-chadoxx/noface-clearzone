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
  const factionLabel = faction ? faction.toUpperCase() : 'UNKNOWN';

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unitData, setUnitData] = useState(() => {
    const savedData = localStorage.getItem(`unitData_${faction}`);
    return savedData ? JSON.parse(savedData) : { callsign: '', agents: '', color: '#ffffff' };
  });
  const [isDeployed, setIsDeployed] = useState(() => {
    return localStorage.getItem(`isDeployed_${faction}`) === 'true';
  });

  const [activeTool, setActiveTool] = useState('hand'); 
  const [strokeWidth, setStrokeWidth] = useState(3); 
  const [activeUnitsList, setActiveUnitsList] = useState([]);
  const [zones, setZones] = useState([]);
  
  const [operationTitle, setOperationTitle] = useState('OPÉRATION STANDARD');
  const [localTitle, setLocalTitle] = useState('OPÉRATION STANDARD');

  useEffect(() => {
    socket.emit('join_faction', { faction: factionLabel });

    if (isDeployed && unitData.callsign) {
      socket.emit('deploy_unit', { ...unitData, faction: factionLabel });
    }

    socket.on('sync_faction_data', (data) => {
      setActiveUnitsList(data.units || []);
      setZones(data.zones || []);
      setOperationTitle(data.operationTitle || 'OPÉRATION STANDARD');
      setLocalTitle(data.operationTitle || 'OPÉRATION STANDARD');
    });

    socket.on('sync_units', (units) => setActiveUnitsList(units));
    socket.on('sync_zones', (updatedZones) => setZones(updatedZones));
    socket.on('sync_operation_title', (title) => {
      setOperationTitle(title);
      setLocalTitle(title);
    });

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') {
        socket.emit('undo_last_zone', { faction: factionLabel });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      socket.off('sync_faction_data');
      socket.off('sync_units');
      socket.off('sync_zones');
      socket.off('sync_operation_title');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [factionLabel, isDeployed, unitData.callsign]); // Correction de dépendances

  useEffect(() => {
    if (isDeployed) {
      localStorage.setItem(`unitData_${faction}`, JSON.stringify(unitData));
      localStorage.setItem(`isDeployed_${faction}`, 'true');
    }
  }, [unitData, isDeployed, faction]);

  const handleDeploy = () => {
    if (unitData.callsign.trim() === '') return;
    setIsDeployed(true);
    setIsSidebarOpen(false);
    socket.emit('deploy_unit', { ...unitData, faction: factionLabel });
  };

  const handleLeaveUnit = () => {
    // On se déconnecte LOCALEMENT, on ne supprime PAS l'unité pour les autres.
    setIsDeployed(false);
    setUnitData({ callsign: '', agents: '', color: '#ffffff' });
    localStorage.removeItem(`unitData_${faction}`);
    localStorage.removeItem(`isDeployed_${faction}`);
  };

  const handleUndo = () => socket.emit('undo_last_zone', { faction: factionLabel });
  const handleClearAll = () => socket.emit('clear_all_zones', { faction: factionLabel });

  const handleTitleBlurOrEnter = () => {
    if (localTitle !== operationTitle) {
      setOperationTitle(localTitle);
      socket.emit('update_operation_title', { faction: factionLabel, title: localTitle });
    }
  };

  return (
    <div translate="no" className="w-screen h-screen flex flex-col bg-black text-slate-200 overflow-hidden select-none relative font-sans">
      
      <header className="absolute top-4 left-4 right-4 h-16 bg-[#050505]/90 backdrop-blur-xl z-[1000] flex items-center justify-between px-6 border border-neutral-800 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.9)]">
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 border border-neutral-800 hover:border-white hover:bg-neutral-900 rounded-lg transition-all text-neutral-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="h-6 w-[1px] bg-neutral-800"></div>

          <div className="flex flex-col">
            <span className="text-[9px] font-mono text-neutral-500 tracking-widest uppercase">DISPATCH // {factionLabel}</span>
            <input 
              type="text" 
              value={localTitle} 
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={handleTitleBlurOrEnter}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleBlurOrEnter()}
              className="bg-transparent text-white font-black tracking-wider text-sm uppercase focus:outline-none border-b border-transparent hover:border-neutral-800 focus:border-white transition-all py-0.5 max-w-[150px] md:max-w-[280px]"
              placeholder="NOMMER L'OPÉRATION..."
            />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 max-w-[40%]" style={{ contentVisibility: 'auto' }}>
          <div className="flex items-center gap-2 overflow-x-auto py-1 px-2 no-scrollbar">
            {activeUnitsList.map((unit) => (
              <div 
                key={unit.callsign} 
                className="flex items-center gap-2 bg-neutral-950 px-3 py-1 border border-neutral-900 rounded-md text-xs font-mono"
                style={{ borderLeft: `3px solid ${unit.color}` }}
              >
                <span className="text-white font-bold">{unit.callsign}</span>
                <span className="text-[10px] text-neutral-500 font-medium">({unit.agents})</span>
              </div>
            ))}
            {activeUnitsList.length === 0 && (
              <span className="text-[10px] font-mono text-neutral-600 tracking-widest italic">[AUCUN MODULE ACTIF]</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isDeployed ? (
            <button onClick={handleLeaveUnit} className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-red-900/40 bg-red-950/10 hover:bg-red-950 text-red-500 hover:text-white rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all">
              <X className="w-3.5 h-3.5" /> Quitter Service
            </button>
          ) : (
            <button onClick={() => setIsSidebarOpen(true)} className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-neutral-800 hover:border-white bg-neutral-950 hover:bg-white hover:text-black rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all">
              <Menu className="w-3.5 h-3.5" /> Prendre Service
            </button>
          )}

          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 border border-neutral-800 hover:border-white bg-neutral-950 rounded-lg text-neutral-400 hover:text-white transition-all">
            <Radio className="w-4 h-4" />
          </button>

          <div className="hidden md:flex items-center gap-2 text-neutral-500 tracking-wider font-mono text-[11px]">
            <span>NET_CH: <span className="text-white font-bold">SEC_0{factionLabel === 'GLOBAL' ? '0' : '1'}</span></span>
          </div>

          <div className="hidden md:block h-4 w-[1px] bg-neutral-800"></div>

          <div className="flex items-center gap-3 bg-black px-4 py-2 border border-neutral-800 rounded-lg shadow-inner">
            <span className="w-2 h-2 bg-white rounded-full animate-[ping_1.5s_infinite] shadow-[0_0_8px_rgba(255,255,255,1)]"></span>
            <span className="text-neutral-400 tracking-widest font-bold text-[10px] uppercase">STATUS: ONLINE</span>
          </div>
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
        factionLabel={factionLabel}
        onDeleteGlobalUnit={(callsign) => socket.emit('delete_global_unit', { callsign, faction: factionLabel })}
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
        factionLabel={factionLabel}
      />

      <div className="absolute bottom-4 left-4 z-[1000] pointer-events-none font-mono text-[10px] text-neutral-600 tracking-widest uppercase">
        [SYS_OP: {isDeployed ? 'ACTIVE_TRACKING' : 'DISPATCH_READY'}]
      </div>
    </div>
  );
};

export default MapInterface;