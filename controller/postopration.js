const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require('../models/comments');

//Handle Likes
const toggleLike = async function (req, res) {
    try {
        let likeable;
        const { type, id, userid } = req.query;

        if (type == 'Post') {
            likeable = await Post.findById(id).populate('likes');
        } else {
            likeable = await Comment.findById(id).populate('likes');
        }
        // check if a like already exists
        let existingLike = await Like.findOne({
            likeable: id,
            onModel: type,
            user: userid
        })
        // if a like already exists then delete it
        if (existingLike) {
            likeable.likes.pull(existingLike._id);
            likeable.save();
            Like.findByIdAndDelete(existingLike._id)
                .then(() => {
                    deleted = true;
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            // else make a new like
            let newLike = await Like.create({
                // req.user._id
                user: userid,
                likeable: id,
                onModel: type
            });
            likeable.likes.push(newLike._id);
            likeable.save();
        }

        const like = await Like.find({
            likeable: id
        })
        return res.json(201, {
            message: "Request successfulsss!",
            data: "deleted",
            likes: like

        })
    } catch (err) {
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}

//Handle Comment
const toggleComment = async (req, res) => {
    try {
        const { id, userid, data } = req.query;
        const post = await Post.findById(id);
        let comment = await Comment.create({
            content: data,
            post: id,
            user: userid
        });
        post.comments.push(comment);
        post.save();
        comment = await comment.populate('user', 'username email');

        return res.status(201).json({ message: "Comment Created", data: comment })
    } catch (err) {
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}

//Get All Comments
const getcomments = async (req, res) => {
    try {
        const { id } = req.query;
        const commentsData = await Comment.find({ post: id }).sort('-createdAt')
        return res.status(201).json({ message: "Comment Created", data: commentsData })
    } catch (err) {
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}

//Edit Comment
const editComment = async (req, res) => {
    const { id, userid, data } = req.query;
    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                message: 'Comment not found',
            });
        }
        if (comment.user.toString() !== userid) {
            return res.status(403).json({
                message: 'Unauthorized',
                success: true,
            });
        }
        comment.content = data;
        await comment.save();
        return res.json({
            message: 'Comment updated successfully',
            success: true,
            data: comment,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
};
module.exports = { toggleLike, toggleComment, getcomments, editComment };
