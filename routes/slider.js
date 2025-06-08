const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/slider');
const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/slider');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/upload', upload.array('files'), sliderController.upload);
router.post('/list', sliderController.list);
router.delete('/delete/:id', sliderController.deleteSlider);
router.get('/images/:img', sliderController.images);
router.post('/update',sliderController.updatePosition);

module.exports = router;