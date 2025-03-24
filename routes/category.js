const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');


router.get('/prueba',categoryController.prueba);    
router.post('/register',categoryController.register);
router.get('/list',categoryController.list);    
router.get('/delete/:id',categoryController.deleteCategory);
router.post('/update/:id',categoryController.update);

module.exports = router;   