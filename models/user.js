const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: { type:String, unique:true },
        password: { type:String }
    }, 
    { collection: 'users'}
)

const model = mongoose.model('UserSchema', userSchema)

module.exports = model