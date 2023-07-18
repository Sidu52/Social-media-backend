const mongoose = require('mongoose');

const postschema = new mongoose.Schema({
    content: {
        type: String
    },
    fileUrl: {
        type: String
    },
    fileType: {
        type: String
    },
    saved: {
        type: Boolean,
        value: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //include the array ids of all comment in this post schema itself
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment'
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
}, {
    timestamps: true
});

const Post = mongoose.model('Post', postschema);
module.exports = Post;