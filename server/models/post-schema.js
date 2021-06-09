// https://stackoverflow.com/questions/28006521/how-to-model-a-likes-voting-system-with-mongodb  LIKE IMPLEMENTATION

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Post = new Schema({
    description: String,
    picture: {
        url: String,
        public_id: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
})

module.exports = mongoose.model('post', Post)