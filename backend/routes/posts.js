const router = require("express").Router();
const postsController = require("../controllers/posts.js");

router.get('/', postsController.getAllPosts);
router.get('/users/:userId', postsController.getPostsForUser);

module.exports = router;