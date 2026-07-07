import React from 'react';
import { MapContainer, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const gtaCrs = L.CRS.Simple;
// On définit la zone de travail
const bounds = [[0, 0], [8192, 8192]];

const SanAndreasMap = () => {
  return (
    <div className="absolute inset-0 z-0 bg-[#020617]">
      <MapContainer 
        crs={gtaCrs} 
        bounds={bounds} 
        center={[4096, 4096]} 
        zoom={-1} 
        minZoom={-2} 
        maxZoom={2} 
        zoomControl={false}
        style={{ height: '100%', width: '100%', backgroundColor: '#020617' }}
      >
        {/* On charge l'image directement depuis ton propre site */}
        <ImageOverlay
          url="/map.jpg"
          bounds={bounds}
        />
      </MapContainer>
    </div>
  );
};

export default SanAndreasMap;