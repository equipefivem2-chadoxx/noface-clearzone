import React, { useEffect, useRef } from 'react';
import { MapContainer, ImageOverlay, Circle, Polygon, Polyline, FeatureGroup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

const gtaCrs = L.CRS.Simple;
const bounds = [[0, 0], [8192, 8192]];

// Sous-composant invisible qui gère l'activation des outils de dessin
const DrawingController = ({ activeTool, setActiveTool, activeColor, socket }) => {
  const map = useMap();
  const drawControlRef = useRef(null);

  useEffect(() => {
    if (!activeTool || activeTool === 'eraser') return;

    if (drawControlRef.current) drawControlRef.current.disable();

    const options = { shapeOptions: { color: activeColor, weight: 3, fillOpacity: 0.2 } };

    if (activeTool === 'circle') drawControlRef.current = new L.Draw.Circle(map, options);
    else if (activeTool === 'polygon') drawControlRef.current = new L.Draw.Polygon(map, options);
    else if (activeTool === 'draw') drawControlRef.current = new L.Draw.Polyline(map, options);

    drawControlRef.current.enable();

    const handleDrawCreated = (e) => {
      const { layerType, layer } = e;
      let zoneData = { type: layerType, color: activeColor };

      if (layerType === 'circle') {
        zoneData.center = layer.getLatLng();
        zoneData.radius = layer.getRadius();
      } else {
        zoneData.latlngs = layer.getLatLngs();
      }

      socket.emit('add_zone', zoneData); // Envoi au serveur
      setActiveTool(null); // Désactive l'outil après le dessin
    };

    map.on(L.Draw.Event.CREATED, handleDrawCreated);
    return () => {
      map.off(L.Draw.Event.CREATED, handleDrawCreated);
      if (drawControlRef.current) drawControlRef.current.disable();
    };
  }, [activeTool, map, activeColor, socket, setActiveTool]);

  return null;
};

const SanAndreasMap = ({ activeColor, isDeployed, activeTool, setActiveTool, zones, socket }) => {
  
  // Fonction pour la gomme
  const handleZoneClick = (zoneId) => {
    if (activeTool === 'eraser') {
      socket.emit('delete_zone', zoneId);
    }
  };

  return (
    <div className={`absolute inset-0 z-0 bg-black ${activeTool === 'eraser' ? 'cursor-crosshair' : ''}`}>
      <MapContainer 
        crs={gtaCrs} bounds={bounds} center={[4096, 4096]} 
        zoom={-2} minZoom={-3} maxZoom={2} zoomControl={false}
        maxBounds={bounds} maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%', backgroundColor: '#000000' }}
      >
        <ImageOverlay url="/map.jpg" bounds={bounds} />
        
        {isDeployed && (
          <DrawingController activeTool={activeTool} setActiveTool={setActiveTool} activeColor={activeColor} socket={socket} />
        )}

        {/* AFFICHAGE DES ZONES EN TEMPS RÉEL */}
        <FeatureGroup>
          {zones.map((zone) => {
            const isEraser = activeTool === 'eraser';
            const pathOptions = { 
              color: isEraser ? '#ef4444' : zone.color, 
              weight: isEraser ? 4 : 3, 
              fillOpacity: isEraser ? 0.5 : 0.2,
              dashArray: isEraser ? '5, 10' : ''
            };

            if (zone.type === 'circle') {
              return <Circle key={zone.id} center={zone.center} radius={zone.radius} pathOptions={pathOptions} eventHandlers={{ click: () => handleZoneClick(zone.id) }} />;
            }
            if (zone.type === 'polygon') {
              return <Polygon key={zone.id} positions={zone.latlngs} pathOptions={pathOptions} eventHandlers={{ click: () => handleZoneClick(zone.id) }} />;
            }
            if (zone.type === 'polyline') {
              return <Polyline key={zone.id} positions={zone.latlngs} pathOptions={pathOptions} eventHandlers={{ click: () => handleZoneClick(zone.id) }} />;
            }
            return null;
          })}
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};

export default SanAndreasMap;