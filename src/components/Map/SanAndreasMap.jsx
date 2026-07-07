import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SanAndreasMap = () => {
  return (
    <div className="absolute inset-0 z-0">
      <MapContainer 
        center={[48.8566, 2.3522]} /* Coordonnées de Paris pour le test */
        zoom={13} 
        zoomControl={false}
        style={{ height: '100vh', width: '100vw' }}
      >
        <TileLayer
          url="https://maps.plebmasters.de/gta5/realmap/M3/mapC_{z}_{x}.png"
        />
      </MapContainer>
    </div>
  );
};

export default SanAndreasMap;