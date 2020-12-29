const router = require("express").Router();
const usersController = require("../controllers/users.js");
const authService = require("../services/auth.js");

router.get("/", usersController.getAllUsers);
router.get("/:userId", usersController.getUser);
router.delete("/:userId", usersController.deleteUser);

module.exports = router;
