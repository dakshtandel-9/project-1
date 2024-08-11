const Listing = require("../models/listing")



module.exports.index = async(req,res)=>{
    const allListing = await Listing.find({})
    res.render('listings/index.ejs',{allListing})
}

module.exports.newListing = (req,res)=>{
    res.render('listings/new.ejs')
}

module.exports.createListing = async (req,res)=>{
    const url = req.file.path
    const filename = req.file.path
    let newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    newListing.image = {url,filename}
    await newListing.save()
    req.flash("success","New listing created")
    res.redirect("/listing")
}

module.exports.editListing = async (req,res)=>{
    let {id} = req.params
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash("error","listing you requested for does not exist!")
        res.redirect("/listing")
    }
    res.render('listings/edit.ejs',{listing})
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof req.file !== "undefined"){
        const url = req.file.path
        const filename = req.file.path
        listing.image = {url,filename}
        await listing.save()
    }
    req.flash("success","listing edided")
    res.redirect(`/listing/${id}`)
}

module.exports.destroyListing = async (req,res)=>{
    let {id} =req.params
    let deleteListing = await Listing.findByIdAndDelete(id)
    req.flash("success","listing deleted")
    res.redirect("/listing")
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params
    let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
    
    if(!listing){
        req.flash("error","listing you requested for does not exist!")
        res.redirect("/listing")
    }
    res.render('listings/show.ejs',{listing})
} 