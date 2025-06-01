const express = require('express');
const router = express.Router();
const tempShopping = require('../controllers/temp_shopping');

router.get('/prueba', tempShopping.prueba);
router.get('/token', tempShopping.returnToken);

module.exports = router;