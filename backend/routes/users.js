const router = require("express").Router();
const usersController = require("../controllers/users.js");

router.get('/', usersController.getAllUsers);

module.exports = router;