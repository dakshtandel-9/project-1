if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

console.log(process.env.SECRET)

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require('ejs-mate')
const ExpressError = require("./utils/ExpressError.js")
const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")
const session = require("express-session")
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")
const userRouter = require("./routes/user.js")

const dbUrl = process.env.ATLASDB

const Store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24 * 3600 
  })

  Store.on("error",(err)=>{
    console.log("error", err)
  })

const sessionOptions = {
    Store:Store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    },
}

app.set("view engine", "ejs")
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname,"/public")))


main()
    .then(()=>{
        console.log("connected db")
    })
    .catch((err)=>{
        console.log(err)
    })

async function main(){
    await mongoose.connect(dbUrl)
}

app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get("/",(req,res)=>{
    res.send("hi, i am root")
})

app.use((req,res,next)=>{
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    next()
})

app.use("/listing",listings)
app.use("/listing/:id/reviews",reviews)
app.use("/",userRouter)




app.all("*",(req,res,next)=>{
    throw new ExpressError(404,"page not found")
})

app.use((err,req,res,next)=>{
    let{statuscode = 500, message= "some thing went wrong"} = err
    res.status(statuscode).render("listings/error.ejs",{err})
})

app.listen(8080,()=>{
    console.log("port 8080 is running")
})