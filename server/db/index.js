const mongoose = require('mongoose')

// mongodb+srv://first_user:3xsGUuyDP9QZSvah@cluster0.p1o46.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/mern_app';
mongoose
.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .catch(e=>{
      console.error('Connection error', e.message)
  })

  const db = mongoose.connection

  module.exports = db