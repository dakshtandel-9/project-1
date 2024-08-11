const express = require("express")
const route = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport")
const {saveRedirectUrl} = require("../middleware.js")
const userController = require("../controllers/user.js")

route.route("/signup")
    .get(userController.signupUser)
    .post(wrapAsync(userController.createUser))

route.route("/login")
    .get(userController.loginUser)
    .post(saveRedirectUrl,passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true
    }),wrapAsync(userController.enterLogin))

route.get("/logout",userController.destroyUser)

module.exports = route