import React, { useEffect, useRef } from 'react';
import { MapContainer, ImageOverlay, Circle, Polygon, Polyline, FeatureGroup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

const gtaCrs = L.CRS.Simple;
const bounds = [[0, 0], [8192, 8192]];

// Contrôleur de dessin optimisé
const DrawingController = ({ activeTool, setActiveTool, activeColor, socket }) => {
  const map = useMap();
  const drawControlRef = useRef(null);
  const currentLineRef = useRef(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    // 1. Nettoyage des outils précédents
    if (drawControlRef.current) drawControlRef.current.disable();
    map.off('mousedown mousemove mouseup');
    map.dragging.enable(); // Réactive le mouvement de carte par défaut

    if (!activeTool || activeTool === 'eraser') return;

    // 2. CRAYON FLUO (Dessin libre 100% fluide, sans React State)
    if (activeTool === 'pen') {
      map.dragging.disable(); // Bloque le déplacement de la carte pendant le dessin
      
      const onMouseDown = (e) => {
        isDrawingRef.current = true;
        // Style "Fluo" : épais, bout rond, légèrement transparent
        currentLineRef.current = L.polyline([e.latlng], { 
          color: activeColor, weight: 8, opacity: 0.6, lineCap: 'round', lineJoin: 'round' 
        }).addTo(map);
      };

      const onMouseMove = (e) => {
        if (!isDrawingRef.current || !currentLineRef.current) return;
        currentLineRef.current.addLatLng(e.latlng); // Ajout ultra-rapide sans re-render
      };

      const onMouseUp = () => {
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;
        map.dragging.enable();

        const latlngs = currentLineRef.current.getLatLngs();
        if (latlngs.length > 1) {
          socket.emit('add_zone', { type: 'polyline', color: activeColor, latlngs });
        }
        
        // On supprime le trait temporaire, le serveur va renvoyer la zone définitive
        currentLineRef.current.remove(); 
        currentLineRef.current = null;
        setActiveTool(null);
      };

      map.on('mousedown', onMouseDown);
      map.on('mousemove', onMouseMove);
      map.on('mouseup', onMouseUp);
      
      return () => { map.off('mousedown mousemove mouseup'); map.dragging.enable(); };
    }

    // 3. OUTILS LEAFLET-DRAW (Pour les formes parfaites comme Cercle/Polygone)
    const options = { shapeOptions: { color: activeColor, weight: 3, fillOpacity: 0.2 } };
    
    if (activeTool === 'circle') drawControlRef.current = new L.Draw.Circle(map, options);
    else if (activeTool === 'polygon') drawControlRef.current = new L.Draw.Polygon(map, options);

    if (drawControlRef.current) drawControlRef.current.enable();

    const handleDrawCreated = (e) => {
      const { layerType, layer } = e;
      let zoneData = { type: layerType, color: activeColor };

      if (layerType === 'circle') {
        zoneData.center = layer.getLatLng();
        zoneData.radius = layer.getRadius();
      } else {
        zoneData.latlngs = layer.getLatLngs();
      }

      socket.emit('add_zone', zoneData);
      setActiveTool(null);
    };

    map.on(L.Draw.Event.CREATED, handleDrawCreated);
    return () => { map.off(L.Draw.Event.CREATED, handleDrawCreated); };

  }, [activeTool, map, activeColor, socket, setActiveTool]);

  return null;
};

const SanAndreasMap = ({ activeColor, isDeployed, activeTool, setActiveTool, zones, socket }) => {
  
  const handleZoneClick = (zoneId) => {
    if (activeTool === 'eraser') {
      socket.emit('delete_zone', zoneId);
    }
  };

  return (
    <div className={`absolute inset-0 z-0 bg-black ${activeTool === 'eraser' ? 'cursor-crosshair' : activeTool === 'pen' ? 'cursor-default' : 'cursor-grab'}`}>
      <MapContainer 
        crs={gtaCrs} bounds={bounds} center={[4096, 4096]} 
        zoom={-2} minZoom={-3} maxZoom={2} zoomControl={false}
        maxBounds={bounds} maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%', backgroundColor: '#000000' }}
        preferCanvas={true} // Extrêmement important pour les perfs de dessin !
      >
        <ImageOverlay url="/map.jpg" bounds={bounds} />
        
        {isDeployed && (
          <DrawingController activeTool={activeTool} setActiveTool={setActiveTool} activeColor={activeColor} socket={socket} />
        )}

        <FeatureGroup>
          {zones.map((zone) => {
            const isEraser = activeTool === 'eraser';
            // Rendu de la polyline (Crayon) vs Rendu classique
            const pathOptions = zone.type === 'polyline' 
              ? { color: isEraser ? '#ef4444' : zone.color, weight: 8, opacity: isEraser ? 0.5 : 0.6, lineCap: 'round', lineJoin: 'round', dashArray: isEraser ? '5, 15' : '' }
              : { color: isEraser ? '#ef4444' : zone.color, weight: isEraser ? 4 : 3, fillOpacity: isEraser ? 0.5 : 0.2, dashArray: isEraser ? '5, 10' : '' };

            if (zone.type === 'circle') return <Circle key={zone.id} center={zone.center} radius={zone.radius} pathOptions={pathOptions} eventHandlers={{ click: () => handleZoneClick(zone.id) }} />;
            if (zone.type === 'polygon') return <Polygon key={zone.id} positions={zone.latlngs} pathOptions={pathOptions} eventHandlers={{ click: () => handleZoneClick(zone.id) }} />;
            if (zone.type === 'polyline') return <Polyline key={zone.id} positions={zone.latlngs} pathOptions={pathOptions} eventHandlers={{ click: () => handleZoneClick(zone.id) }} />;
            
            return null;
          })}
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};

export default SanAndreasMap;