import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuration du monde plat de GTA V
const gtaCrs = L.CRS.Simple;
const bounds = [[-4000, -4000], [4000, 4000]];

const SanAndreasMap = () => {
  return (
    <div className="absolute inset-0 z-0 bg-[#020617]">
      <MapContainer 
        crs={gtaCrs} 
        bounds={bounds} 
        center={[0, 0]} /* POINT DE DÉPART DE LA CAMÉRA (Centre de la map) */
        zoom={2}        /* NIVEAU DE ZOOM INITIAL */
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