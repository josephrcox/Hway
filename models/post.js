const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
    {
        type: { type:Number, required:true }, // 1=text, 2=link, 3=media
        status: { type:String, required:true, default:"active"}, //active, deleted, removed
        title: { type:String, required:true },
        body: { type:String },
        poster: { type:String, required:true},
        posterID: { type:String },
        posterAvatarSrc: { type:String, default:""},
        link: { type:String }, // only if type=2 or type=3
        topic: { type:String, default: "all"},
        date: { type: String, default: Date.now },
        timestamp: { type: String },
        total_votes: { type: Number, default: 0},
        upvotes: { type: Number, default: 0},
        downvotes: { type: Number, default: 0},
        users_upvoted: { type: Array},
        users_downvoted: { type: Array },
        current_user_upvoted: { type: Boolean},
        current_user_downvoted: { type: Boolean},
        current_user_admin: { type: Boolean},
        comments: { type: Array},

    },
    { collection: 'posts'}
)

const model = mongoose.model('PostSchema', postSchema)


module.exports = model