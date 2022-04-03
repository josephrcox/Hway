const mongoose = require('mongoose')

const nestedCommentSchema = new mongoose.Schema(
    {
        body: { type:String, required:true },
        poster: { type:String, required:true },
        posterID: { type:String, required:true },
        status: { type:String, required:true, default:"active "},
        total_votes: { type:Number, required:true, default:0 },
        users_voted: { type:Array, required:true, default:[]},
        current_user_upvoted: { type: Boolean},
        current_user_admin: { type: Boolean},
    }, {timestamps:true}
)

const commentSchema = new mongoose.Schema(
    {
        body: { type:String, required:true },
        nested_comments: [nestedCommentSchema],
        poster: { type:String, required:true },
        posterID: { type:String, required:true },
        status: { type:String, required:true, default:"active "},
        total_votes: { type:Number, required:true, default:0 },
        users_voted: { type:Array, required:true, default:[]},
        current_user_upvoted: { type: Boolean},
        current_user_admin: { type: Boolean},
    }, {timestamps:true}
)


const model = mongoose.model('CommentSchema', commentSchema)


module.exports = model