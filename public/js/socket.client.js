document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // 1. Rejoindre la room
    socket.emit('join-map', MAP_ID);

    // 2. Gestion de l'UI
    const btnNewUnit = document.getElementById('btn-new-unit');
    const modalUnit = document.getElementById('modal-unit');
    const btnCancelUnit = document.getElementById('btn-cancel-unit');
    const btnConfirmUnit = document.getElementById('btn-confirm-unit');
    const inputUnitName = document.getElementById('unit-name-input');
    const modalError = document.getElementById('modal-error');
    const unitsList = document.getElementById('units-list');
    const tacticalTools = document.getElementById('tactical-tools');

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
            }
        });
    });

    // 3. Réception Serveur -> Client
    socket.on('unit-added', (unit) => {
        const emptyState = document.querySelector('.empty-state');
        if (emptyState) emptyState.remove();

        const card = document.createElement('div');
        card.className = 'unit-card';
        card.dataset.id = unit.id;
        card.dataset.color = unit.color;
        
        card.innerHTML = `
            <div class="unit-color" style="--u-color: ${unit.color};"></div>
            <span class="unit-name">${unit.name}</span>
            <button class="btn-delete" title="Retirer l'unité">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        `;
        unitsList.appendChild(card);
    });

    socket.on('unit-removed', (unitId) => {
        const card = document.querySelector(`.unit-card[data-id="${unitId}"]`);
        if (card) card.remove();
        
        if (window.selectedUnit && window.selectedUnit.id === unitId) {
            window.selectedUnit = null;
            tacticalTools.classList.add('hidden'); // Cache les outils si l'unité disparaît
        }

        if (unitsList.children.length === 0) {
            unitsList.innerHTML = '<div class="empty-state">Aucune unité n\'est déployée sur ce secteur.</div>';
        }
    });

    // 4. Délégation d'événements pour Sélectionner (carte entière) / Supprimer
    unitsList.addEventListener('click', (e) => {
        const card = e.target.closest('.unit-card');
        if (!card) return;

        const unitId = card.dataset.id;
        const unitColor = card.dataset.color;

        // Clic sur Corbeille
        if (e.target.closest('.btn-delete')) {
            socket.emit('delete-unit', unitId);
            return;
        }

        // Clic sur le reste de la carte = Sélection
        document.querySelectorAll('.unit-card').forEach(c => {
            c.classList.remove('active');
            c.style.borderColor = 'var(--border-light)';
        });
        
        card.classList.add('active');
        card.style.borderColor = unitColor;
        
        window.selectedUnit = { id: unitId, color: unitColor };
        
        // Affiche l'équipement tactique !
        tacticalTools.classList.remove('hidden');
    });

    window.tacticalSocket = socket;
});