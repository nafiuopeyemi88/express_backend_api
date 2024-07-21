const mongoose = require('mongoose')


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


const TagSchema  = new mongoose.Schema({
    slug: {
        type: String,
    },
    name: {
        type: String, 
        required: [true, ]
    },
    logo: {
        type: String, 
    }
})


const PluginSchema = new mongoose.Schema({
    slug: {
        type: String, 
    },
    name: {
        type: String, 
        required: [true]
    },
    logo: {
        type: String, 
    }
})

const ToolSchema = new mongoose.Schema({
    slug: {
        type: String, 
    },
    name: {
        type: String, 
        required: [true]
    },
    logo: {
        type: String
    }
})

const ProjectSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'] 
     },
    title: {
        type: String,
        required: [true, "provide project title"],
    },
    content: {
         type: String,
         required: [true, 'must provide project word content']
     },
     tags: [TagSchema],

     plugins: [PluginSchema],
     tools: [ToolSchema],
     image: {
        type: String, 
        required: [true, 'provide sample image']
     },

     is_draft: {
        type: Boolean,
        default: false,
     },
     is_private: {
        type: Boolean,
        default: true,
     },
     bookmarks: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
     likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
     comment: [CommentSchema],
     date: { type: Date, default: Date.now }
}) 

module.exports = mongoose.model('Project', ProjectSchema)   