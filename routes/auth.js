const express = require('express'),
    router = express.Router(),
    authController = require('../controllers/auth.js')

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/login", authController.showLoginPage)
router.get("/register", authController.showRegisterPage)
router.post("/register", authController.register)
router.get("/changePassword", authController.showChangePassPage)
router.post("/changePassword", authController.changePassword)


module.exports = router;