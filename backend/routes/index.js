const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const userRouter = require("./users");
const postRouter = require("./posts");

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/posts", postRouter);

module.exports = router;