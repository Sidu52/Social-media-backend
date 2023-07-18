const express = require('express');
const router = express.Router();
const multer = require('multer')
const passport = require('passport')

// Set up multer storage and file handling
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = function (req, file, cb) {
    // Accept image and video files only
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only image and video files are allowed.'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const { createPost, updateUserAvatar, getPosts, getReels, getpostanduserByID, savepost } = require('../controller/homecontroller')

router.post('/createpost', upload.single('img'), createPost);
router.get('/', getPosts);
router.get('/reels', getReels);
router.post('/updatepost', upload.single('img'), updateUserAvatar);
router.post('/getbyID', getpostanduserByID);
router.post('/savepost', savepost);

module.exports = router;

