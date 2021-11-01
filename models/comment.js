const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
    {
        body: { type:String, required:true },
        poster: { type:String, required:true},
        date: { type: Date, default: Date.now },
        total_votes: { type: Number, default: 1}
    }, 
    { collection: 'comments'}
)

const model = mongoose.model('CommentSchema', commentSchema)

module.exports = model