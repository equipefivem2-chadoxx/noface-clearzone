import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Radio, Target, Activity, Menu } from 'lucide-react';
import { io } from 'socket.io-client';
import SanAndreasMap from '../components/Map/SanAndreasMap';
import UnitManager from '../components/Tactical/UnitManager';
import DrawToolbar from '../components/Tactical/DrawToolbar';

// Connexion automatique au serveur (Local ou Railway)
const socket = io(window.location.origin.includes('localhost') ? 'http://localhost:3001' : window.location.origin);

const MapInterface = () => {
  const { faction } = useParams();
  const navigate = useNavigate();

  // ÉTATS DE BASE
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unitData, setUnitData] = useState({ callsign: '', agents: '', color: '#ffffff' });
  const [isDeployed, setIsDeployed] = useState(false);

  // ÉTATS TEMPS RÉEL (HUD & DESSIN)
  const [activeTool, setActiveTool] = useState(null);
  const [activeUnitsList, setActiveUnitsList] = useState([]);
  const [zones, setZones] = useState([]);

  const factionLabel = faction ? faction.toUpperCase() : 'UNKNOWN';

  // Synchronisation avec le serveur
  useEffect(() => {
    socket.on('sync_data', (data) => {
      setActiveUnitsList(data.units || []);
      setZones(data.zones || []);
    });

    socket.on('sync_units', (units) => setActiveUnitsList(units));
    socket.on('sync_zones', (updatedZones) => setZones(updatedZones));

    return () => {
      socket.off('sync_data');
      socket.off('sync_units');
      socket.off('sync_zones');
    };
  }, []);

  const handleDeploy = () => {
    if (unitData.callsign.trim() === '') return;
    setIsDeployed(true);
    setIsSidebarOpen(false);
    // Déploiement sur le réseau
    socket.emit('deploy_unit', unitData);
  };

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
              RESEAU TACTIQUE <span className="text-neutral-500 font-light">//</span> {factionLabel}
              {isDeployed && (
                <>
                  <span className="text-neutral-500 font-light">//</span>
                  <span style={{ color: unitData.color }}>[{unitData.callsign}]</span>
                </>
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs">
          <div className="hidden md:flex items-center gap-2 text-neutral-500 tracking-wider">
            <Radio className="w-4 h-4 text-neutral-400" />
            <span>NET_CH: <span className="text-white font-bold">SEC_0{factionLabel === 'GLOBAL' ? '0' : '1'}</span></span>
          </div>
          <div className="hidden md:block h-4 w-[1px] bg-neutral-800"></div>
          <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-2 bg-black px-4 py-2 border border-neutral-700 hover:border-white rounded-lg shadow-inner transition-colors group cursor-pointer">
            <Menu className="w-4 h-4 group-hover:text-white text-neutral-400" />
            <span className="text-neutral-400 group-hover:text-white tracking-widest font-bold text-[10px] uppercase">UNITÉS</span>
          </button>
        </div>
      </header>

      {/* PANNEAUX ET OUTILS */}
      <UnitManager 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        unitData={unitData}
        setUnitData={setUnitData}
        isDeployed={isDeployed}
        onDeploy={handleDeploy}
        activeUnitsList={activeUnitsList} // Synchronisation de la liste
      />

      <DrawToolbar 
        activeColor={unitData.color} 
        isDeployed={isDeployed} 
        activeTool={activeTool}
        setActiveTool={setActiveTool} // Gestion de l'outil cliqué
      />

      {/* COMPOSANT CARTE AVANCÉ */}
      <SanAndreasMap 
        activeColor={unitData.color} 
        isDeployed={isDeployed}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        zones={zones}
        socket={socket}
      />

      <div className="absolute bottom-4 left-4 z-[1000] pointer-events-none font-mono text-[10px] text-neutral-600 tracking-widest uppercase">
        [SYS_OP: {isDeployed ? 'ACTIVE_TRACKING' : 'DISPATCH_READY'}]
      </div>
      <div className="absolute bottom-4 right-4 z-[1000] pointer-events-none font-mono text-[10px] text-neutral-600 tracking-widest uppercase flex items-center gap-2">
        <Activity className="w-3 h-3 animate-pulse" /> GRID_SCALE: 1:1
      </div>
    </div>
  );
};

export default MapInterface;