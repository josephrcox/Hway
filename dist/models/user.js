// @ts-nocheck
const mongoose = require('mongoose')
let datetime = new Date()
let month = datetime.getUTCMonth()+1
let day = datetime.getUTCDate()
let year = datetime.getUTCFullYear()
let hour = datetime.getUTCHours()
let minute = datetime.getUTCMinutes()
let timestamp = Date.now()
let ampm
let sminute = minute

if (hour > 12) {
    ampm = "PM"
    hour -= 12
} else {
    ampm = "AM"
}
if (minute < 10) {
    sminute = "0"+minute
}

let fulldatetime = month+"/"+day+"/"+year+" at "+hour+":"+sminute+" "+ampm+" UTC"

const userSchema = new mongoose.Schema(
    {
        name: { type:String, unique:true },
        password: { type:String },
        avatar: { type:String},
        show_nsfw: {type:Boolean, default:false},
        notifications: { type:Array, default:[]}, // [type (comment), string of notification heading, postID, avatar of user initiated change]
        
        subscriptions: {
            topics: { type:Array, default:[]},
            users: { type:Array, default:[]},
        },

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
                ip_address: { type:Array, default:""},
                approximate_location: { type:Array, default:""},
                account_creation_date: { type:Array, default: [fulldatetime, Date.now()] },
            },
            score: { type:Number, default:0},
        }
    }, 
    { collection: 'users'}
)

const model = mongoose.model('UserSchema', userSchema)

module.exports = model