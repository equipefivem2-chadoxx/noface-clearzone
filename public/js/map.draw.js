document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const map = window.tacticalMap;
        const socket = window.tacticalSocket;
        const mapContainer = document.getElementById('map-container');
        
        // Mode de base : Navigation
        window.tacticalState = {
            tool: 'nav',
            size: 3
        };
        
        let isDrawing = false;
        let isEraserActive = false; // Pour la gomme "swipe"
        let currentPolyline = null;
        let currentPath = [];
        let currentLineId = null;
        
        const drawnItems = {};

        // 1. Initialisation des boutons
        document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tool-btn[data-tool]').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                window.tacticalState.tool = e.currentTarget.dataset.tool;
                if (e.currentTarget.dataset.size) {
                    window.tacticalState.size = parseInt(e.currentTarget.dataset.size);
                }
                
                // MAJ du curseur CSS
                mapContainer.className = '';
                if (window.tacticalState.tool === 'nav') mapContainer.classList.add('cursor-grab');
                else if (window.tacticalState.tool === 'eraser') mapContainer.classList.add('cursor-eraser');
                else mapContainer.classList.add('cursor-draw');
            });
        });

        // Corbeille globale
        document.getElementById('btn-clear-all')?.addEventListener('click', () => {
            if (!window.selectedUnit) return;
            const uId = window.selectedUnit.id;
            socket.emit('clear-drawings', uId);
            if (drawnItems[uId]) {
                Object.values(drawnItems[uId]).forEach(line => map.removeLayer(line));
                drawnItems[uId] = {};
            }
        });

        // 2. Logique Tactique
        map.on('mousedown', (e) => {
            if (!window.selectedUnit) return;

            if (window.tacticalState.tool === 'nav') {
                mapContainer.classList.add('cursor-grabbing');
                return; // On laisse Leaflet gérer le déplacement normal
            }

            if (window.tacticalState.tool === 'eraser') {
                isEraserActive = true;
                return;
            }

            // Mode Dessin (Pencil ou Fluo)
            map.dragging.disable();
            isDrawing = true;
            currentPath = [e.latlng];
            currentLineId = 'L_' + Date.now() + Math.random().toString(36).substr(2, 9);

            const opacity = window.tacticalState.tool === 'fluo' ? 0.4 : 1.0;

            currentPolyline = L.polyline(currentPath, {
                color: window.selectedUnit.color,
                weight: window.tacticalState.size,
                opacity: opacity,
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
            if (window.tacticalState.tool === 'nav') {
                mapContainer.classList.remove('cursor-grabbing');
                mapContainer.classList.add('cursor-grab');
                return;
            }

            isEraserActive = false;

            if (!isDrawing) return;
            isDrawing = false;
            map.dragging.enable();

            if (currentPath.length > 1 && window.selectedUnit) {
                const uId = window.selectedUnit.id;
                const opacity = window.tacticalState.tool === 'fluo' ? 0.4 : 1.0;
                
                if (!drawnItems[uId]) drawnItems[uId] = {};
                drawnItems[uId][currentLineId] = currentPolyline;

                socket.emit('draw-line', {
                    action: 'draw',
                    lineId: currentLineId,
                    unitId: uId,
                    color: window.selectedUnit.color,
                    size: window.tacticalState.size,
                    opacity: opacity,
                    latlngs: currentPath
                });
            } else if (currentPolyline) {
                map.removeLayer(currentPolyline);
            }
            currentPolyline = null;
        });

        // 3. Logique de Gomme Magique
        function eraseLine(polyline, unitId, lineId) {
            if (window.selectedUnit && window.selectedUnit.id === unitId) {
                map.removeLayer(polyline);
                if (drawnItems[unitId]) delete drawnItems[unitId][lineId];
                socket.emit('draw-line', { action: 'erase', lineId: lineId, unitId: unitId });
            }
        }

        function attachLineEvents(polyline, unitId, lineId) {
            // Efface au clic
            polyline.on('click', () => {
                if (window.tacticalState.tool === 'eraser') eraseLine(polyline, unitId, lineId);
            });
            // Efface au survol si la souris est pressée (Swipe Eraser)
            polyline.on('mouseover', () => {
                if (window.tacticalState.tool === 'eraser' && isEraserActive) eraseLine(polyline, unitId, lineId);
            });
        }

        // 4. Réception Serveur
        socket.on('line-drawn', (data) => {
            const uId = data.unitId;

            if (data.action === 'erase') {
                if (drawnItems[uId] && drawnItems[uId][data.lineId]) {
                    map.removeLayer(drawnItems[uId][data.lineId]);
                    delete drawnItems[uId][data.lineId];
                }
                return;
            }

            const remotePolyline = L.polyline(data.latlngs, {
                color: data.color,
                weight: data.size || 6,
                opacity: data.opacity || 1.0,
                lineCap: 'round',
                lineJoin: 'round',
                className: 'neon-draw'
            }).addTo(map);

            attachLineEvents(remotePolyline, uId, data.lineId);

            if (!drawnItems[uId]) drawnItems[uId] = {};
            drawnItems[uId][data.lineId] = remotePolyline;
        });

        socket.on('drawings-cleared', (unitId) => {
            if (drawnItems[unitId]) {
                Object.values(drawnItems[unitId]).forEach(line => map.removeLayer(line));
                drawnItems[unitId] = {};
            }
        });

        socket.on('unit-removed', (unitId) => {
            if (drawnItems[unitId]) {
                Object.values(drawnItems[unitId]).forEach(line => map.removeLayer(line));
                delete drawnItems[unitId];
            }
        });

    }, 500);
});