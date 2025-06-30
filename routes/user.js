const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authRefresh = require('../middleware/authRefresh');
const auth = require('../middleware/auth');



router.get('/prueba',userController.prueba);
router.post('/register',userController.register);
router.post('/login',userController.login);
router.get('/profile/:id',userController.profile);
router.post('/auth-google',userController.authGoogle);
router.get('/refresh',authRefresh.authRefresh,userController.refresh);
router.get('/logout',userController.logout);

module.exports = router;    