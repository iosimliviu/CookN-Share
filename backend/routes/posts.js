const router = require("express").Router();
const postsController = require("../controllers/posts.js");
const authService = require("../services/auth.js");

router.delete("/:postId", authService.checkLogin, postsController.deletePost);
router.get("/:postId", postsController.getPost);
router.post("/", authService.checkLogin, postsController.createPost);
router.get("/", postsController.getAllPosts);
router.get("/users/:userId", postsController.getPostsForUser);
router.put("/:postId", authService.checkLogin, postsController.updatePost);

module.exports = router;
