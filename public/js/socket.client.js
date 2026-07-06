document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    window.tacticalSocket = socket;

    // Connexion immédiate au canal crypté du département
    socket.emit("join-map", window.MAP_ID);

    const btnNewUnit = document.getElementById("btn-new-unit");
    const modal = document.getElementById("modal-unit");
    const btnCancel = document.getElementById("btn-cancel-unit");
    const btnConfirm = document.getElementById("btn-confirm-unit");
    const input = document.getElementById("unit-name-input");
    const error = document.getElementById("modal-error");
    const list = document.getElementById("units-list");

    window.selectedUnit = null;

    // MODAL ACTIONS
    btnNewUnit.onclick = () => {
        modal.classList.remove("hidden");
        error.textContent = "";
        setTimeout(() => input.focus(), 100);
    };

    btnCancel.onclick = () => {
        modal.classList.add("hidden");
        input.value = "";
    };

    btnConfirm.onclick = () => {
        const name = input.value.trim().toUpperCase();
        if(!name) {
            error.textContent = "DECREE INVALID: FIELD DESIGNATION REQUIREMENT EMPTY.";
            return;
        }

        socket.emit("create-unit", name, (res) => {
            if(res.success) {
                modal.classList.add("hidden");
                input.value = "";
                selectUnit(res.unit);
            } else {
                error.textContent = `CRITICAL FAILURE: ${res.message}`;
            }
        });
    };

    // GESTION DE SÉLECTION D'UNE UNITÉ ACTICE
    window.selectUnit = function(unit) {
        window.selectedUnit = unit;
        document.querySelectorAll('.unit-card-active').forEach(c => c.classList.remove('selected'));
        
        const card = document.getElementById(`unit-${unit.id}`);
        if(card) card.classList.add('selected');

        showNotification("UNIT LINK", `CONNECTED OPERATIONAL UPLINK TO ${unit.name}`);
    };

    // INJECTION DES RECEPTIONS SOCKET TIME-REAL
    socket.on("unit-added", (unit) => {
        removeEmptyState();
        appendUnitCard(unit);
        showNotification("RADAR DEPLOYMENT", `NEW UNIT DETECTED ON GRID: ${unit.name}`);
    });

    socket.on("unit-removed", (unitId) => {
        const card = document.getElementById(`unit-${unitId}`);
        if(card) card.remove();
        
        if(window.selectedUnit && window.selectedUnit.id === unitId) {
            window.selectedUnit = null;
            showNotification("LINK LOSS", "PREVIOUS UNIT RETIRED FROM SYSTEM OPERATIONS.", true);
        }
        checkEmptyState();
    });

    function appendUnitCard(unit) {
        if(document.getElementById(`unit-${unit.id}`)) return;

        const card = document.createElement("div");
        card.id = `unit-${unit.id}`;
        card.className = "unit-card-active";
        card.style.setProperty('--unit-color', unit.color);
        
        // Bordure gauche aux couleurs fluo exclusives assignées à l'unité
        card.style.borderLeft = `4px solid ${unit.color}`;

        card.innerHTML = `
            <div class="unit-info-block">
                <span class="unit-name-title">${unit.name}</span>
                <span class="unit-status-tag" style="color: ${unit.color}">● MONITORING FIELD</span>
            </div>
            <button class="btn-delete-unit" title="Retirer l'unité">×</button>
        `;

        card.addEventListener('click', (e) => {
            if(e.target.classList.contains('btn-delete-unit')) return;
            selectUnit(unit);
        });

        card.querySelector('.btn-delete-unit').onclick = (e) => {
            e.stopPropagation();
            socket.emit("delete-unit", unit.id);
        };

        list.appendChild(card);
    }

    function removeEmptyState() {
        const empty = document.querySelector(".empty-state");
        if(empty) empty.remove();
    }

    function checkEmptyState() {
        if(list.children.length === 0) {
            list.innerHTML = `<div class="empty-state">NO ACTIVE DEPLOYMENT IN GRID</div>`;
        }
    }

    // SYSTÈME DE NOTIFICATIONS HUD EN BAS À GAUCHE
    window.showNotification = function(title, text, isDanger = false) {
        const container = document.getElementById("hud-notifier-container");
        const box = document.createElement("div");
        box.className = "hud-notification";
        if(isDanger) box.style.borderColor = "var(--danger)";

        box.innerHTML = `
            <div style="font-weight: 800; font-size: 11px; letter-spacing: 1px; color: #fff;">[ ${title} ]</div>
            <div style="font-size: 13px; color: var(--text-muted); margin-top: 3px;">${text}</div>
        `;

        container.appendChild(box);
        setTimeout(() => {
            box.style.transform = "translateX(-150%)";
            box.style.transition = "transform 0.4s ease";
            setTimeout(() => box.remove(), 400);
        }, 4000);
    };
});