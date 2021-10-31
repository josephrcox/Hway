const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: { type:String, unique:true },
        password: { type:String },
        date: { type: Date, default: Date.now },
        post_count: { type: Number, default: 0},
        comment_count: { type: Number, default: 0},
        total_votes: { type: Number, default: 0},
        account_active: { type: Boolean, default: true}
    }, 
    { collection: 'users'}
)

const model = mongoose.model('UserSchema', userSchema)

module.exports = model