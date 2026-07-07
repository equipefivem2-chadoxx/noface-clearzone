import React from 'react';
import { MapContainer, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuration pour un monde plat (jeu vidéo)
const gtaCrs = L.CRS.Simple;
const bounds = [[0, 0], [8192, 8192]];

const SanAndreasMap = () => {
  return (
    <div className="absolute inset-0 z-0 bg-[#143d6b]">
      <MapContainer 
        crs={gtaCrs} 
        bounds={bounds} 
        center={[4096, 4096]} 
        zoom={-2} 
        minZoom={-4} 
        maxZoom={2} 
        zoomControl={false}
        style={{ height: '100%', width: '100%', backgroundColor: '#143d6b' }}
      >
        {/* Chargement de l'image locale */}
        <ImageOverlay
          url="/map.jpg"
          bounds={bounds}
        />
      </MapContainer>
    </div>
  );
};

export default SanAndreasMap;