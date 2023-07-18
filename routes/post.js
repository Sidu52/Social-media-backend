const express = require('express');
const passport = require('passport');
const router = express.Router();

const { toggleLike, toggleComment, getcomments, editComment } = require('../controller/postopration');

router.post('/like', toggleLike);
router.post('/comment', toggleComment);
router.get('/', getcomments);
router.put('/comment', editComment);

module.exports = router;