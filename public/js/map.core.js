document.addEventListener('DOMContentLoaded', () => {
    // 1. Configuration de Leaflet pour une image plate (pas une vraie map monde)
    // On utilise L.CRS.Simple pour les jeux vidéos
    const map = L.map('map-container', {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 2,
        zoomControl: false // On désactive pour avoir un rendu clean (on peut zoomer molette)
    });

    // 2. Définition des dimensions de l'image (À ajuster selon ton image HD)
    // Ici on simule une map de 8192x8192 pixels
    const bounds = [[0, 0], [8192, 8192]];

    // 3. Application de l'image sur la carte Leaflet
    L.imageOverlay('/assets/map-gta5.jpg', bounds).addTo(map);

    // 4. Centrage par défaut
    map.fitBounds(bounds);
    map.setZoom(-1);

    // On rend l'instance map globale pour pouvoir l'utiliser dans map.draw.js plus tard
    window.tacticalMap = map;

    console.log(`[MAP CORE] Carte initialisée pour la zone : ${MAP_ID}`);
});