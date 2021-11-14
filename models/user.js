const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: { type:String, unique:true },
        password: { type:String },
        date: { type: Date, default: Date.now },
        total_votes: { type: Number, default: 0},
        statistics: {
            created_posts: { type:Number, default: 0 },
            created_comments: { type:Number, default: 0 },
            viewed_posts: { type:Number, default: 0 },
            viewed_comments: { type:Number, default: 0 },
            misc_logged_in: { type:Number, default: 0 },
            misc_logged_out: { type:Number, default: 0 },
            voted_posts: { type:Number, default: 0 },
            voted_comments: { type:Number, default: 0 },
            account_creation_date: { type:Date, default: Date.now() },
        }
    }, 
    { collection: 'users'}
)

const model = mongoose.model('UserSchema', userSchema)

module.exports = model