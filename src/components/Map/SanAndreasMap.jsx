import React from 'react';
import { MapContainer, ImageOverlay } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuration pour un monde plat (jeu vidéo)
const gtaCrs = L.CRS.Simple;
const bounds = [[0, 0], [8192, 8192]];

const SanAndreasMap = () => {
  return (
    // Le fond passe en noir pour éviter d'avoir du bleu moche autour de la carte au dézommage
    <div className="absolute inset-0 z-0 bg-black">
      <MapContainer 
        crs={gtaCrs} 
        bounds={bounds} 
        center={[4096, 4096]} // Centre exact de la map GTA (8192 / 2)
        zoom={-2} 
        minZoom={-3} // Empêche de dézoomer trop loin et de perdre la carte de vue
        maxZoom={2} 
        zoomControl={false}
        
        // CORRECTION DU CENTRAGE AU DEZOMMAGE :
        maxBounds={bounds} // Verrouille la caméra dans les limites réelles de l'image
        maxBoundsViscosity={1.0} // Force à 100% le fait que l'utilisateur ne puisse pas sortir des bordures
        
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