const mongoose = require('mongoose')

const guestSchema = new mongoose.Schema(
    {
        ip_address: { type:String, required:true},
        approximate_location: { type:String, required:false},
        times_visited: { type:Number, required:true, default:0}
    }, 
    { collection: 'guests'}
)

const model = mongoose.model('GuestSchema', guestSchema)

module.exports = model