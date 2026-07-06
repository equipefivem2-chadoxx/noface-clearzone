document.addEventListener('DOMContentLoaded', () => {
    // On attend un léger délai pour s'assurer que map.core.js a initialisé window.tacticalMap
    setTimeout(() => {
        const map = window.tacticalMap;
        const socket = window.tacticalSocket;
        
        let isDrawing = false;
        let currentPolyline = null;
        let currentPath = [];
        
        // Stockage de tous les tracés pour pouvoir les effacer
        // Format: { unitId: [polyline1, polyline2, ...] }
        const drawnItems = {};

        // 1. Logique de dessin local
        map.on('mousedown', (e) => {
            if (!window.selectedUnit) return; // Impossible de dessiner si aucune unité sélectionnée

            // Désactiver le glisser de la carte pendant le dessin
            map.dragging.disable();
            isDrawing = true;
            currentPath = [e.latlng];

            // Création de la ligne avec un style "Surligneur Fluo"
            currentPolyline = L.polyline(currentPath, {
                color: window.selectedUnit.color,
                weight: 8,          // Épais comme un vrai marqueur
                opacity: 0.6,       // Semi-transparent
                lineCap: 'round',
                lineJoin: 'round',
                className: 'neon-draw'
            }).addTo(map);
        });

        map.on('mousemove', (e) => {
            if (!isDrawing || !currentPolyline) return;
            
            currentPath.push(e.latlng);
            currentPolyline.setLatLngs(currentPath);

            // Optionnel: On pourrait émettre en temps réel ici pour voir le crayon bouger
            // Mais pour optimiser les performances, on émet le tracé complet au "mouseup"
        });

        map.on('mouseup', () => {
            if (!isDrawing) return;
            isDrawing = false;
            map.dragging.enable(); // Réactiver le glisser

            if (currentPath.length > 1 && window.selectedUnit) {
                // Sauvegarder localement
                if (!drawnItems[window.selectedUnit.id]) drawnItems[window.selectedUnit.id] = [];
                drawnItems[window.selectedUnit.id].push(currentPolyline);

                // Envoyer au serveur
                socket.emit('draw-line', {
                    unitId: window.selectedUnit.id,
                    color: window.selectedUnit.color,
                    latlngs: currentPath
                });
            } else if (currentPolyline) {
                // Si c'est juste un clic (pas un trait), on supprime
                map.removeLayer(currentPolyline);
            }
            currentPolyline = null;
        });

        // 2. Réception des dessins des autres
        socket.on('line-drawn', (drawData) => {
            const remotePolyline = L.polyline(drawData.latlngs, {
                color: drawData.color,
                weight: 8,
                opacity: 0.6,
                lineCap: 'round',
                lineJoin: 'round',
                className: 'neon-draw'
            }).addTo(map);

            if (!drawnItems[drawData.unitId]) drawnItems[drawData.unitId] = [];
            drawnItems[drawData.unitId].push(remotePolyline);
        });

        // Bonus: Quand une unité est supprimée, on efface ses traits de la carte
        socket.on('unit-removed', (unitId) => {
            if (drawnItems[unitId]) {
                drawnItems[unitId].forEach(line => map.removeLayer(line));
                delete drawnItems[unitId];
            }
        });

    }, 500);
});