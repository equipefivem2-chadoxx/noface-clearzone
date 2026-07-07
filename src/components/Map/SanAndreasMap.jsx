import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// On dit à Leaflet que c'est une carte de jeu vidéo (monde plat)
const gtaCrs = L.CRS.Simple;
const bounds = [[-4000, -4000], [4000, 4000]];

const SanAndreasMap = () => {
  return (
    <div className="absolute inset-0 z-0 bg-[#020617]">
      <MapContainer 
        crs={gtaCrs} 
        bounds={bounds} 
        minZoom={1} 
        maxZoom={5} 
        zoomControl={false}
        style={{ height: '100%', width: '100%', backgroundColor: '#020617' }}
      >
        <TileLayer
          url="https://s.rsg.sc/sc/images/games/GTAV/map/render/radar/{z}/{x}/{y}.jpg"
          noWrap={true}
          bounds={bounds}
        />
      </MapContainer>
    </div>
  );
};

export default SanAndreasMap;