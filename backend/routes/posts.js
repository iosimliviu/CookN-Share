const router = require("express").Router();
const postsController = require("../controllers/posts.js");
const authService = require("../services/auth.js");

router.delete("/:postId", postsController.deletePost);
router.get("/:postId", postsController.getPost);
router.post("/", postsController.createPost);
router.get("/", postsController.getAllPosts);
router.get("/users/:userId", postsController.getPostsForUser);
router.put("/:postId", postsController.updatePost);
router.get("/loc/az", postsController.getAllPostsLocationAZ);

module.exports = router;
