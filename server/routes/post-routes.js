const express = require('express');
const router = express.Router();
const Post = require('../models/post-schema');
const PostCtrl = require('../controllers/post-ctrl');



router.route('/feed')
    .get(PostCtrl.showAllPosts)
    .post(PostCtrl.createPost)
router.route('/post/:id')
    .put(PostCtrl.updateSelectedPost)
    .delete(PostCtrl.deletePost)

module.exports = router