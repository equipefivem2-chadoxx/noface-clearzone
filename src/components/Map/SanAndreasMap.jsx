import React, { useEffect, useRef } from 'react';
import { MapContainer, ImageOverlay, Circle, Polygon, Polyline, FeatureGroup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

const gtaCrs = L.CRS.Simple;
const bounds = [[0, 0], [8192, 8192]];

const DrawingController = ({ activeTool, activeColor, socket, strokeWidth }) => {
  const map = useMap();
  const drawControlRef = useRef(null);
  const currentLineRef = useRef(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    if (drawControlRef.current) drawControlRef.current.disable();
    map.off('mousedown mousemove mouseup');
    map.dragging.enable(); 

    if (!activeTool || activeTool === 'hand' || activeTool === 'eraser') return;

    if (activeTool === 'pen') {
      map.dragging.disable();
      const onMouseDown = (e) => {
        isDrawingRef.current = true;
        currentLineRef.current = L.polyline([e.latlng], { 
          color: activeColor, weight: strokeWidth, opacity: 0.6, lineCap: 'round', lineJoin: 'round' 
        }).addTo(map);
      };
      const onMouseMove = (e) => {
        if (!isDrawingRef.current || !currentLineRef.current) return;
        currentLineRef.current.addLatLng(e.latlng);
      };
      const onMouseUp = () => {
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;
        const latlngs = currentLineRef.current.getLatLngs();
        
        if (latlngs.length > 1 && socket) {
          socket.emit('add_zone', { type: 'polyline', color: activeColor, latlngs, weight: strokeWidth });
        }
        currentLineRef.current.remove(); 
        currentLineRef.current = null;
      };
      map.on('mousedown', onMouseDown);
      map.on('mousemove', onMouseMove);
      map.on('mouseup', onMouseUp);
      return () => { map.off('mousedown mousemove mouseup'); map.dragging.enable(); };
    }

    const options = { shapeOptions: { color: activeColor, weight: 3, fillOpacity: 0.2 } };
    if (activeTool === 'circle') drawControlRef.current = new L.Draw.Circle(map, options);
    else if (activeTool === 'polygon') drawControlRef.current = new L.Draw.Polygon(map, options);
    if (drawControlRef.current) drawControlRef.current.enable();

    const handleDrawCreated = (e) => {
      const { layerType, layer } = e;
      let zoneData = { type: layerType, color: activeColor, weight: 3 };
      
      if (layerType === 'circle') {
        zoneData.center = layer.getLatLng();
        zoneData.radius = layer.getRadius();
      } else {
        zoneData.latlngs = layer.getLatLngs();
      }
      
      if (socket) socket.emit('add_zone', zoneData);
      if (drawControlRef.current) drawControlRef.current.enable();
    };

    map.on(L.Draw.Event.CREATED, handleDrawCreated);
    return () => { map.off(L.Draw.Event.CREATED, handleDrawCreated); };
  }, [activeTool, map, activeColor, socket, strokeWidth]);

  return null;
};

const SanAndreasMap = ({ 
  activeColor = '#ef4444', 
  isDeployed = false, 
  activeTool = 'hand', 
  setActiveTool, 
  strokeWidth = 3, 
  zones = [], 
  socket = null 
}) => {
  const handleZoneClick = (zoneId) => {
    if (activeTool === 'eraser' && socket) socket.emit('delete_zone', zoneId);
  };

  return (
    <div className={`absolute inset-0 z-0 bg-[#143d6b] ${activeTool === 'eraser' ? 'cursor-crosshair' : activeTool === 'pen' ? 'cursor-default' : 'cursor-grab'}`}>
      
      {/* CSS MAGIQUE POUR Tuer LE LAG : Force l'accélération matérielle sur l'image */}
      <style>{`.gpu-accelerated-image { will-change: transform; backface-visibility: hidden; transform: translateZ(0); }`}</style>
      
      <MapContainer 
        crs={gtaCrs} 
        bounds={bounds} 
        center={[4096, 4096]} 
        zoom={-2} 
        minZoom={-3} 
        maxZoom={2} 
        zoomControl={false}
        maxBounds={bounds} 
        maxBoundsViscosity={1.0}
        zoomSnap={0.1} 
        zoomDelta={0.5} 
        wheelPxPerZoomLevel={120} 
        style={{ height: '100%', width: '100%', backgroundColor: '#143d6b' }}
        preferCanvas={true} 
      >
        <ImageOverlay url="/map.webp" bounds={bounds} className="gpu-accelerated-image" />
        
        {isDeployed && (
          <DrawingController activeTool={activeTool} activeColor={activeColor} socket={socket} strokeWidth={strokeWidth} />
        )}

        <FeatureGroup>
          {zones.map((zone) => {
            const isEraser = activeTool === 'eraser';
            const pathOptions = zone.type === 'polyline' 
              ? { color: isEraser ? '#ef4444' : zone.color, weight: zone.weight || 8, opacity: isEraser ? 0.5 : 0.6, lineCap: 'round', lineJoin: 'round', dashArray: isEraser ? '5, 15' : '' }
              : { color: isEraser ? '#ef4444' : zone.color, weight: zone.weight || 3, fillOpacity: isEraser ? 0.5 : 0.2, dashArray: isEraser ? '5, 10' : '' };

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