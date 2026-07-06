const { AVAILABLE_COLORS } = require('../config/constants');

// Base de données en mémoire (par carte)
const mapsData = {
    bcso: { units: [], drawings: [], availableColors: [...AVAILABLE_COLORS] },
    lspd: { units: [], drawings: [], availableColors: [...AVAILABLE_COLORS] },
    all: { units: [], drawings: [], availableColors: [...AVAILABLE_COLORS] }
};

class MapStoreService {
    static getMapData(mapId) {
        return mapsData[mapId] || null;
    }

    static addUnit(mapId, unitName) {
        const map = this.getMapData(mapId);
        if (!map || map.availableColors.length === 0) return null;

        const color = map.availableColors.shift(); // Prend la première couleur dispo
        const newUnit = { id: Date.now().toString(), name: unitName, color };
        map.units.push(newUnit);
        
        return newUnit;
    }

    static removeUnit(mapId, unitId) {
        const map = this.getMapData(mapId);
        if (!map) return false;

        const unitIndex = map.units.findIndex(u => u.id === unitId);
        if (unitIndex !== -1) {
            const unit = map.units[unitIndex];
            map.availableColors.push(unit.color); // Remet la couleur dispo
            map.units.splice(unitIndex, 1);
            return true;
        }
        return false;
    }
}

module.exports = MapStoreService;