module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`[SOCKET] Unité connectée : ${socket.id}`);

        // Ici, on rattachera les autres fichiers modulaires plus tard
        // require('./zone')(io, socket);
        // require('./unit')(io, socket);

        socket.on('disconnect', () => {
            console.log(`[SOCKET] Unité déconnectée : ${socket.id}`);
        });
    });
};