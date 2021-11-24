const mongoose = require('mongoose')

const guestSchema = new mongoose.Schema(
    {
        ip_address: { type:String, required:true},
        approximate_location: { type:JSON, required:false},
        visited_num: { type:Number, required:true, default:1},
        visited_datetime_array: { type:Array, default:[]}
    }, 
    { collection: 'guests'}
)

const model = mongoose.model('GuestSchema', guestSchema)

module.exports = model