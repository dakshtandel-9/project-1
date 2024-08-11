const express = require("express")
const route = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync.js")
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")
const listingController = require("../controllers/listing.js")
const multer = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})



route.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing))

route.get("/new",isLoggedIn,listingController.newListing)

route.route("/edit/:id")
    .get(isLoggedIn,isOwner,wrapAsync(listingController.editListing))
    

route.route("/:id")
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))

module.exports = route