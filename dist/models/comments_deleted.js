const mongoose = require('mongoose')

const deleted_commentsSchema = new mongoose.Schema(
    {
        post: { type:String, required:true},
        body: { type:String },
        poster: { type:String, required:true},
        posterID: { type:String },
        is_nested: { type:Boolean, required:true},
        nested_parent: { type:String },
        
        date: { type: String, default: Date.now },
        timestamp: { type: String, default: Date.now},
        date_deleted: { type: String, default: Date.now },
        users_voted: { type: Array},
        nested_comments: { type: Array},

        deleted_by: { type:String, required:true, default:'user' }, // user, admin, bot
    },
    { collection: 'deleted_comments'}
)

const model = mongoose.model('DeletedCommentsSchema', deleted_commentsSchema)


module.exports = model