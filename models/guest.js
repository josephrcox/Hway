const mongoose = require('mongoose')

const guestSchema = new mongoose.Schema(
    {
        name: { type:String, unique:true },
        password: { type:String },
        
        statistics: {
            posts: {
                created_num: { type:Number, default: 0 },
                created_array: { type:Array, default: []},
                viewed_num: { type:Number, default: 0 },
                viewed_array: { type:Array, default: []},
                votedOn_num: { type:Number, default: 0 },
                votedOn_array: { type:Array, default: []},
            },
            topics: {
                visited_num: { type:Number, default: 0 },
                visited_array: { type:Array, default: []},
            },
            comments: {
                created_num: { type:Number, default: 0 },
                created_array: { type:Array, default: []},
                votedOn_num: { type:Number, default: 0 },
                votedOn_array: { type:Array, default: []},
            },
            misc: {
                login_num: { type:Number, default: 0 },
                login_array: { type:Array, default: []},
                logout_num: { type:Number, default: 0 },
                logout_array: { type:Array, default: []},
                approximate_location: { type:String, default:""},
                account_creation_date: { type:Date, default: Date.now() },
            },
            score: { type:Number, default:0},
        }
    }, 
    { collection: 'guests'}
)

const model = mongoose.model('GuestSchema', guestSchema)

module.exports = model