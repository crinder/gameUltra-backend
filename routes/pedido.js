const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedido');


router.get('/prueba',pedidoController.prueba);    
router.post('/register',pedidoController.register);
router.get('/list',pedidoController.list);    
router.get('/delete/:id',pedidoController.deletePedido);
router.post('/update/:id',pedidoController.update);

module.exports = router;    