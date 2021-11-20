const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: { type:String, unique:true },
        password: { type:String },
        
        statistics: {
            created_posts: { type:Number, default: 0 },
            created_comments: { type:Number, default: 0 },
            viewed_posts: { type:Number, default: 0 },
            viewed_comments: { type:Number, default: 0 },
            misc_logged_in: { type:Number, default: 0 },
            misc_logged_out: { type:Number, default: 0 },
            misc_times_visited: { type:Number, default: 0},
            misc_approximate_location: { type:String, default: ""},
            topics_visited: { type:Array, default: []},
            votedOn_posts: { type:Number, default: 0 },
            votedOn_comments: { type:Number, default: 0 },
            total_votes: { type: Number, default: 0},
            account_creation_date: { type:Date, default: Date.now() },
        }
    }, 
    { collection: 'users'}
)

const model = mongoose.model('UserSchema', userSchema)

module.exports = model