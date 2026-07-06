const express = require('express');
const router = express.Router();
const mapController = require('../controllers/map.controller');

// Route GET paramétrée pour les différentes cartes tactiques
router.get('/:id', mapController.renderMap);

module.exports = router;