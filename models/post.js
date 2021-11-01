const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
    {
        title: { type:String, required:true },
        body: { type:String },
        poster: { type:String, required:true},
        link: { type:String },
        topic: { type:String, default: "all"},
        type: { type:Number, required:true }, // 1=text, 2=link, 3=media
        date: { type: Date, default: Date.now },
        comment_count: { type: Number, default: 0},
        total_votes: { type: Number, default: 1},
        upvotes: { type: Number, default: 1},
        downvotes: { type: Number, default: 0},
        users_upvoted: { type: Array},
        users_downvoted: { type: Array }
    }, 
    { collection: 'posts'}
)

const model = mongoose.model('PostSchema', postSchema)

module.exports = model