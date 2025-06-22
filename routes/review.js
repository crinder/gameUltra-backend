const   express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review');
const auth = require('../middleware/auth');


router.get('/prueba',reviewController.prueba);    
router.post('/register',auth.auth,reviewController.register);
router.get('/list/:id',reviewController.listOne);    
router.get('/delete/:id',auth.auth,reviewController.deleteReview);
router.post('/update/:id',auth.auth,reviewController.update);

module.exports = router;