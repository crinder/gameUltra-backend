const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authRefresh = require('../middleware/authRefresh');



router.get('/prueba',userController.prueba);
router.post('/register',userController.register);
router.post('/login',userController.login);
router.get('/profile/:id',userController.profile);
router.post('/auth-google',userController.authGoogle);
router.get('/refresh',authRefresh.authRefresh,userController.refresh);

module.exports = router;    