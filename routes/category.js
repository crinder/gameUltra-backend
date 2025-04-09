const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/category')
    },
    filename: (req, file, cb) => {
        let filename = Date.now() + '_' + 'category_'+ file.originalname;
        cb(null, filename)
    }
});


const upload = multer({ storage });

router.get('/prueba',categoryController.prueba);
router.get('/list',categoryController.list);    
router.get('/delete/:id',categoryController.deleteCategory);
router.post('/update/:id',categoryController.update);
router.post('/upload', upload.single('file'), categoryController.upload);
router.get('/images/:img', categoryController.images);
router.get('/list-one/:id', categoryController.listOne);

module.exports = router;   