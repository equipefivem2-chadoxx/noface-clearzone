const unitEvents = require('./events/unit.events');
const drawEvents = require('./events/draw.events');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`[SOCKET] Unité connectée : ${socket.id}`);

        // L'utilisateur rejoint le canal crypté de son département
        socket.on('join-map', (mapId) => {
            socket.join(mapId);
            socket.mapId = mapId; // On stocke l'ID de la carte dans le socket de l'utilisateur
            console.log(`[SOCKET] ${socket.id} a rejoint le canal tactique : ${mapId}`);
        });

        // Chargement des modules d'événements
        unitEvents(io, socket);
        drawEvents(io, socket);

        socket.on('disconnect', () => {
            console.log(`[SOCKET] Déconnexion : ${socket.id}`);
        });
    });
};