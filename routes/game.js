const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/game')
    },
    filename: (req, file, cb) => {
        let filename = Date.now() + '_' + 'category_'+ file.originalname;
        cb(null, filename)
    }
});

const upload = multer({ storage });


router.get('/prueba',gameController.prueba);    
router.post('/register',gameController.register);
router.get('/list',gameController.list);    
router.get('/delete/:id',gameController.deleteGame);
router.post('/update/:id',gameController.update);
router.post('/upload', upload.single('file'), gameController.upload);
router.get('/images/:img', gameController.images);
router.get('/list-one/:id', gameController.listOne);

module.exports = router;