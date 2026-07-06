document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // 1. Rejoindre la room correspondante à la carte actuelle
    socket.emit('join-map', MAP_ID);

    // 2. Gestion de l'UI - Modale Unité
    const btnNewUnit = document.getElementById('btn-new-unit');
    const modalUnit = document.getElementById('modal-unit');
    const btnCancelUnit = document.getElementById('btn-cancel-unit');
    const btnConfirmUnit = document.getElementById('btn-confirm-unit');
    const inputUnitName = document.getElementById('unit-name-input');
    const modalError = document.getElementById('modal-error');
    const unitsList = document.getElementById('units-list');

    // Variable globale pour stocker l'unité actuellement sélectionnée
    window.selectedUnit = null;

    btnNewUnit.addEventListener('click', () => {
        modalUnit.classList.remove('hidden');
        inputUnitName.focus();
    });

    btnCancelUnit.addEventListener('click', () => {
        modalUnit.classList.add('hidden');
        inputUnitName.value = '';
        modalError.textContent = '';
    });

    // Demande de création au serveur
    btnConfirmUnit.addEventListener('click', () => {
        const name = inputUnitName.value.trim();
        if (!name) return;

        socket.emit('create-unit', name, (response) => {
            if (!response.success) {
                modalError.textContent = response.message;
            } else {
                modalUnit.classList.add('hidden');
                inputUnitName.value = '';
                modalError.textContent = '';
                // L'unité sera ajoutée visuellement via l'événement 'unit-added' ci-dessous
            }
        });
    });

    // 3. Réception des événements Serveur -> Client
    socket.on('unit-added', (unit) => {
        // Enlever le message "Aucune unité" s'il existe
        const emptyState = document.querySelector('.empty-state');
        if (emptyState) emptyState.remove();

        const card = document.createElement('div');
        card.className = 'unit-card';
        card.dataset.id = unit.id;
        card.dataset.color = unit.color;
        
        card.innerHTML = `
            <div class="unit-color" style="--u-color: ${unit.color};"></div>
            <span class="unit-name">${unit.name}</span>
            <button class="btn-select">Sélectionner</button>
            <button class="btn-delete">✕</button>
        `;
        unitsList.appendChild(card);
    });

    socket.on('unit-removed', (unitId) => {
        const card = document.querySelector(`.unit-card[data-id="${unitId}"]`);
        if (card) card.remove();
        
        // Si l'unité supprimée était celle sélectionnée, on désélectionne
        if (window.selectedUnit && window.selectedUnit.id === unitId) {
            window.selectedUnit = null;
            document.querySelectorAll('.unit-card').forEach(c => c.style.borderColor = 'var(--glass-border)');
        }

        if (unitsList.children.length === 0) {
            unitsList.innerHTML = '<div class="empty-state">Aucune unité déployée.</div>';
        }
    });

    // 4. Délégation d'événements pour Sélection / Suppression (Remplace les onclick)
    unitsList.addEventListener('click', (e) => {
        const card = e.target.closest('.unit-card');
        if (!card) return;

        const unitId = card.dataset.id;
        const unitColor = card.dataset.color;

        if (e.target.classList.contains('btn-delete')) {
            socket.emit('delete-unit', unitId);
        } else if (e.target.classList.contains('btn-select')) {
            // Effet visuel de sélection
            document.querySelectorAll('.unit-card').forEach(c => c.style.borderColor = 'var(--glass-border)');
            card.style.borderColor = unitColor;
            
            // On assigne l'unité sélectionnée à la variable globale utilisée par Leaflet
            window.selectedUnit = { id: unitId, color: unitColor };
            console.log(`[UI] Unité activée : ${unitId}`);
        }
    });

    // On rend le socket global pour que map.draw.js puisse l'utiliser pour émettre les tracés
    window.tacticalSocket = socket;
});