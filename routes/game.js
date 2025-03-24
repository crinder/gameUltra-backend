const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game');


router.get('/prueba',gameController.prueba);    
router.post('/register',gameController.register);
router.get('/list',gameController.list);    
router.get('/delete/:id',gameController.deleteGame);
router.post('/update/:id',gameController.update);

module.exports = router;