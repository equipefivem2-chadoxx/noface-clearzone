const express = require('express');
const router = express.Router();

const homeRoutes = require('./home.routes');
const mapRoutes = require('./map.routes');

router.use('/', homeRoutes);
router.use('/map', mapRoutes);

module.exports = router;