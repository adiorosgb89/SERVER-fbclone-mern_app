const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const User = new Schema({
    name: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true,
        unique: true
    },
    username: {
        type: String,
        // required: true,
        unique: true
    },
    profile_pic: {
        url: String,
        public_id: String
    
      }
})

User.plugin(passportLocalMongoose)

module.exports = mongoose.model('user', User)