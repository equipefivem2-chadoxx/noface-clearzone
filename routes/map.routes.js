const MapStoreService = require('../services/mapStore.service');

exports.renderMap = (req, res) => {
    const mapId = req.params.id.toLowerCase();
    const validMaps = ['bcso', 'lspd', 'all'];

    if (!validMaps.includes(mapId)) {
        return res.redirect('/');
    }

    const mapData = MapStoreService.getMapData(mapId);

    res.render('map', {
        title: `Operations - ${mapId.toUpperCase()}`,
        mapId: mapId,
        units: mapData.units
    });
};