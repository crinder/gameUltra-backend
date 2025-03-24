const   express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review');


router.get('/prueba',reviewController.prueba);    
router.post('/register',reviewController.register);
router.get('/list/:id',reviewController.listOne);    
router.get('/delete/:id',reviewController.deleteReview);
router.post('/update/:id',reviewController.update);

module.exports = router;