const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedido');
const auth = require('../middleware/auth');


router.get('/prueba',pedidoController.prueba);    
router.post('/register',auth.auth,pedidoController.register);
router.get('/list',auth.auth,pedidoController.list);    
router.get('/delete/:id',pedidoController.deletePedido);
router.post('/update/:id',pedidoController.update);

module.exports = router;    