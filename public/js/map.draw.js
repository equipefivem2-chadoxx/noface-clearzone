document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const map = window.tacticalMap;
        const socket = window.tacticalSocket;
        const mapContainer = document.getElementById('map-container');
        
        // Configuration de base des outils
        window.tacticalState = {
            tool: 'draw',
            size: 8
        };
        
        let isDrawing = false;
        let currentPolyline = null;
        let currentPath = [];
        let currentLineId = null;
        
        // Format: { unitId: { lineId: polylineObject } }
        const drawnItems = {};

        // 1. Initialisation des boutons de la ToolBox
        document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                window.tacticalState.tool = e.currentTarget.dataset.tool;
                if (e.currentTarget.dataset.size) {
                    window.tacticalState.size = parseInt(e.currentTarget.dataset.size);
                }
                
                // Changement de curseur
                if (window.tacticalState.tool === 'eraser') {
                    mapContainer.classList.add('cursor-eraser');
                } else {
                    mapContainer.classList.remove('cursor-eraser');
                }
            });
        });

        // Fonction d'effacement complet (Corbeille)
        document.getElementById('btn-clear-all')?.addEventListener('click', () => {
            if (!window.selectedUnit) return;
            const uId = window.selectedUnit.id;
            
            socket.emit('clear-drawings', uId);
            
            // Efface localement
            if (drawnItems[uId]) {
                Object.values(drawnItems[uId]).forEach(line => map.removeLayer(line));
                drawnItems[uId] = {};
            }
        });

        // 2. Logique de dessin local
        map.on('mousedown', (e) => {
            if (!window.selectedUnit || window.tacticalState.tool === 'eraser') return;

            map.dragging.disable();
            isDrawing = true;
            currentPath = [e.latlng];
            currentLineId = 'L_' + Date.now() + Math.random().toString(36).substr(2, 9); // ID unique

            currentPolyline = L.polyline(currentPath, {
                color: window.selectedUnit.color,
                weight: window.tacticalState.size,
                opacity: 0.7,
                lineCap: 'round',
                lineJoin: 'round',
                className: 'neon-draw'
            }).addTo(map);

            attachLineEvents(currentPolyline, window.selectedUnit.id, currentLineId);
        });

        map.on('mousemove', (e) => {
            if (!isDrawing || !currentPolyline) return;
            currentPath.push(e.latlng);
            currentPolyline.setLatLngs(currentPath);
        });

        map.on('mouseup', () => {
            if (!isDrawing) return;
            isDrawing = false;
            map.dragging.enable();

            if (currentPath.length > 1 && window.selectedUnit) {
                const uId = window.selectedUnit.id;
                
                if (!drawnItems[uId]) drawnItems[uId] = {};
                drawnItems[uId][currentLineId] = currentPolyline;

                // Envoyer au serveur (action normale de dessin)
                socket.emit('draw-line', {
                    action: 'draw',
                    lineId: currentLineId,
                    unitId: uId,
                    color: window.selectedUnit.color,
                    size: window.tacticalState.size,
                    latlngs: currentPath
                });
            } else if (currentPolyline) {
                map.removeLayer(currentPolyline);
            }
            currentPolyline = null;
        });

        // Fonction pour lier la gomme (click) sur un tracé
        function attachLineEvents(polyline, unitId, lineId) {
            polyline.on('click', () => {
                if (window.tacticalState && window.tacticalState.tool === 'eraser') {
                    // On vérifie que le joueur gomme bien une ligne appartenant à son unité activée
                    if (window.selectedUnit && window.selectedUnit.id === unitId) {
                        map.removeLayer(polyline);
                        if (drawnItems[unitId]) delete drawnItems[unitId][lineId];
                        
                        // Utilisation du relais serveur "draw-line" pour envoyer un ordre d'effacement ciblé
                        socket.emit('draw-line', { action: 'erase', lineId: lineId, unitId: unitId });
                    }
                }
            });
        }

        // 3. Réception des flux des autres unités
        socket.on('line-drawn', (data) => {
            const uId = data.unitId;

            // L'autre unité demande l'effacement d'une ligne précise (Outil Gomme)
            if (data.action === 'erase') {
                if (drawnItems[uId] && drawnItems[uId][data.lineId]) {
                    map.removeLayer(drawnItems[uId][data.lineId]);
                    delete drawnItems[uId][data.lineId];
                }
                return;
            }

            // Réception normale d'un tracé
            const remotePolyline = L.polyline(data.latlngs, {
                color: data.color,
                weight: data.size || 8,
                opacity: 0.7,
                lineCap: 'round',
                lineJoin: 'round',
                className: 'neon-draw'
            }).addTo(map);

            attachLineEvents(remotePolyline, uId, data.lineId);

            if (!drawnItems[uId]) drawnItems[uId] = {};
            drawnItems[uId][data.lineId] = remotePolyline;
        });

        // Réception du nettoyage complet d'une unité (Bouton Clear)
        socket.on('drawings-cleared', (unitId) => {
            if (drawnItems[unitId]) {
                Object.values(drawnItems[unitId]).forEach(line => map.removeLayer(line));
                drawnItems[unitId] = {};
            }
        });

        // Si une unité se déconnecte / est supprimée
        socket.on('unit-removed', (unitId) => {
            if (drawnItems[unitId]) {
                Object.values(drawnItems[unitId]).forEach(line => map.removeLayer(line));
                delete drawnItems[unitId];
            }
        });

    }, 500);
});