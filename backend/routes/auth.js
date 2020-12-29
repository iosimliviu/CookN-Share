const router = require("express").Router();
const authController = require("../controllers/auth.js");
const authService = require("../services/auth.js");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authService.checkLogin, authController.logout);

module.exports = router;
