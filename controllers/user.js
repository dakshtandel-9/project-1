const User = require("../models/user.js")

module.exports.signupUser = (req,res)=>{
    res.render("listings/users/signup.ejs")
}

module.exports.createUser = async(req,res)=>{
    try{
        let {username,email,password} = req.body
    const newUser = new User({email,username})
    const registeredUser = await User.register(newUser,password)
    req.login(registeredUser,(err)=>{
        if(err){
            return next()
        }
        req.flash("success","user was registered")
        res.redirect("/listing")
    })
    
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}

module.exports.loginUser = (req,res)=>{
    res.render("listings/users/login.ejs")
}

module.exports.enterLogin = async(req,res)=>{
    req.flash("success","welcome back to your account")
    let redirectUrl = res.locals.redirectUrl || "listing"
    res.redirect(redirectUrl)
}

module.exports.destroyUser = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            next()
        }
        req.flash("success","you logged out")
        res.redirect("/listing")
    })
}