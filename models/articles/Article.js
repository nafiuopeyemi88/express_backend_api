const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    author: {
       type: mongoose.Types.ObjectId,
       ref: 'User',
       required: [true, 'Please provide user'] 
    },
    body: {
        type: String,
        required: [true, 'must provide comment body']
    },
    date: { type: Date, default: Date.now }
})


const ArticleSchema = new mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    },
    title: {
        type: String,
        required: [true, 'must provide article title'],
        trim: true,
        maxlength: [20, 'article title can not be more than 20 characters'],
    },
    sub_title: {
        type: String,
        required: [true, 'must provide article sub_title'],
        trim: true,
        maxlength: [50, 'article sub_title can not be more than 50 characters'],
    },
    content: {
        type: String,
        required: [true, 'provide article content'],
    },
    optional_image : {
        type: String,
    },
    comments: [CommentSchema],
    bookmarks: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    is_draft: {
        type: Boolean,
        default: false,
    },
    is_private: {
        type: Boolean,
        default: false,
    },
},

{ timestamps: true },
)

module.exports = mongoose.model('Article', ArticleSchema)


 