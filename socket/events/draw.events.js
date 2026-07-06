module.exports = (io, socket) => {
    // Lorsqu'un trait est dessiné
    socket.on('draw-line', (drawData) => {
        const mapId = socket.mapId;
        if (!mapId) return;

        // On relaie le tracé à TOUS les autres utilisateurs de la room (sauf l'expéditeur)
        socket.to(mapId).emit('line-drawn', drawData);
    });

    // Lorsqu'une unité efface ses propres tracés
    socket.on('clear-drawings', (unitId) => {
        const mapId = socket.mapId;
        if (!mapId) return;

        socket.to(mapId).emit('drawings-cleared', unitId);
    });
};