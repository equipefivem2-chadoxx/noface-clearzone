const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');

// Route GET pour la page d'accueil
router.get('/', homeController.renderHome);

module.exports = router;