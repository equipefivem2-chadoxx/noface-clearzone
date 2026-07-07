import React from 'react';
import { MapContainer, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const gtaCrs = L.CRS.Simple;
const bounds = [[0, 0], [8192, 8192]];

// On récupère activeColor et isDeployed depuis MapInterface
const SanAndreasMap = ({ activeColor, isDeployed }) => {
  return (
    <div className="absolute inset-0 z-0 bg-black">
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
        // Correction de la couleur de fond ici :
        style={{ height: '100%', width: '100%', backgroundColor: '#000000' }}
      >
        <ImageOverlay
          url="/map.jpg"
          bounds={bounds}
        />
        
        {/* C'est ici que l'on viendra rajouter les outils pour colorier la carte 
            en utilisant la variable "activeColor" sélectionnée dans le panneau ! */}
            
      </MapContainer>
    </div>
  );
};

export default SanAndreasMap;