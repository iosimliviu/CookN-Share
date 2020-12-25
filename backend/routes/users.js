const router = require("express").Router();
const usersController = require("../controllers/users.js");

router.get("/", usersController.getAllUsers);
router.get("/:userId", usersController.getUser);
router.delete("/:userId", usersController.deleteUser);

module.exports = router;
