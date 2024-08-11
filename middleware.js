const express = require("express")
const Review = require("./models/review.js")
const Listing = require("./models/listing.js")
const {listingSchema,reviewSchema} = require("./schema.js")
const ExpressError = require("./utils/ExpressError.js")

module.exports.isLoggedIn = (req,res,next)=>{
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.redirectUrl = req.originalUrl
    req.flash('error', 'You must be logged in to do that');
    res.redirect('/login');
}


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params
    let listing = await Listing.findById(id)
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you dont have permition")
        return res.redirect(`/listing/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let{id,reviewId} = req.params
    let review = await Review.findById(reviewId)
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not the author")
        return res.redirect(`/listing/${id}`)
    }
    next()
}

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        next(new ExpressError(404, errMsg));
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        next(new ExpressError(404, errMsg));
    } else {
        next();
    }
};