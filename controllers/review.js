const Listing = require("../models/listing")
const Review = require("../models/review.js")

module.exports.postReview  = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","new review created")
    if(!listing){
        req.flash("error","listing you requested for does not exist!")
        res.redirect("/listing")
    }
    res.redirect(`/listing/${listing._id}`)
}

module.exports.destroyReview = async (req,res) =>{
    let {id,reviewId} = req.params

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","review deleted")
    res.redirect(`/listing/${id}`)
}