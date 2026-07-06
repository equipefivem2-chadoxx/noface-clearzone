const MapStoreService = require('../../services/mapStore.service');

module.exports = (io, socket) => {
    
    // Création d'une nouvelle unité
    socket.on('create-unit', (unitName, callback) => {
        const mapId = socket.mapId;
        if (!mapId) return callback({ success: false, message: "Erreur de canal tactique." });

        const newUnit = MapStoreService.addUnit(mapId, unitName);
        
        if (!newUnit) {
            return callback({ success: false, message: "Plus aucune couleur fluo disponible." });
        }

        // Informer tous les autres clients sur CETTE carte spécifique
        io.to(mapId).emit('unit-added', newUnit);
        
        // Répondre au client qui a fait la demande
        callback({ success: true, unit: newUnit });
    });

    // Suppression d'une unité
    socket.on('delete-unit', (unitId) => {
        const mapId = socket.mapId;
        if (!mapId) return;

        const success = MapStoreService.removeUnit(mapId, unitId);
        if (success) {
            // Informer tout le monde que l'unité est retirée
            io.to(mapId).emit('unit-removed', unitId);
        }
    });
};