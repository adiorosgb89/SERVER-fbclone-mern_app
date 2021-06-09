if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
  }

const morgan = require('morgan')
const express = require('express')
const session = require('express-session');
const MongoDBStore = require('connect-mongo');
// const flash = require('connect-flash');
const passport = require('passport');
// const LocalStrategy = require('passport-local');
const app = express()
const cors = require('cors')
const User = require('./models/user-schema')

// SECURITY
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");

// ROUTES
const userRoutes = require('./routes/user-routes')
const postRoutes = require('./routes/post-routes')

// CONFIGURE DATABASE
const db = require('./db/index')
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/mern_app';

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
    console.log('Database connected');
})
// PARSE BODY
app.use(morgan('dev'));
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended:true, limit: '50mb'}))
app.use(cors({credentials:true,origin:"https://fbclone-mernapp.herokuapp.com/"}))

// SESSION CONFIG

const secret = process.env.SECRET || 'fbsecret'

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
  })
store.on('error', console.error.bind(console, 'MongoDB connection error:'));

const sessionConfig = {
    
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    store,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
//app.use(cors())

// security / verification
app.use(mongoSanitize());
app.use(helmet({contentSecurityPolicy: false}));

// app.use(flash());

// PASSPORT.JS CONFIG 
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.options('*', cors())




app.use('/api', cors({credentials:true,origin:"http://localhost:8000"}), userRoutes,postRoutes)

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`SERVER RUNNING ON PORT ${port}`)
})