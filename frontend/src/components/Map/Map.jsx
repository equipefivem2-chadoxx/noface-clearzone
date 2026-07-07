import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuration pour une carte de jeu vidéo (Monde plat)
const gtaCrs = L.CRS.Simple;

// Les limites de la carte GTA V. À ajuster selon les tuiles que tu utiliseras.
// Ces valeurs correspondent généralement à la taille de l'image de la map.
const mapBounds = [
  [-4000, -4000],
  [4000, 4000]
];

const Map = () => {
  return (
    <div className="absolute inset-0 z-0 bg-slate-950">
      <MapContainer
        crs={gtaCrs}
        bounds={mapBounds}
        minZoom={1}
        maxZoom={5}
        zoomControl={false} // On désactive pour mettre un contrôle custom plus tard
        style={{ height: '100%', width: '100%', backgroundColor: '#020617' }}
      >
        <TileLayer
          // URL temporaire pour tester. Il faudra mettre tes propres images dans /assets/map-tiles/
          // ou utiliser un serveur externe qui héberge la map de GTA V.
          url="https://s.rsg.sc/sc/images/games/GTAV/map/render/radar/{z}/{x}/{y}.jpg"
          noWrap={true}
          bounds={mapBounds}
        />
        
        {/* Le composant de dessin viendra s'insérer ici */}
        {/* <Draw /> */}
      </MapContainer>
    </div>
  );
};

export default Map;