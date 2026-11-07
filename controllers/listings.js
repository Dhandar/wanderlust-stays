const Listing  = require("../models/listing.js") ;

module.exports.index = async(req,res) =>{
        const allListings =  await Listing.find({});
        res.render("listings/index.ejs",{allListings}) ;
}

module.exports.renderNewForm = (req,res) =>{
    res.render("listings/new.ejs")
}

module.exports.showListing = async(req,res) =>{
    let {id} = req.params ;
    const listing = await Listing.findById(id)
        .populate({
            path : "reviews" ,
            populate : {
                path : "author"
            },
        })
        .populate("owner") ;
    
    if(!listing){
        req.flash("error" ,"Listing you requested does not exits!!");
        return res.redirect("/listings");
    }
    console.log(listing);
    console.log(listing.owner);
    res.render("listings/show.ejs",{ listing })
}

module.exports.createListing = async(req,res,next) =>{
    let url = req.file.path ;
    let filename = req.file.filename ;
    const  newListing = new Listing(req.body.listing) ;
    newListing.owner = req.user._id ;    
    newListing.image = { url,filename } ;   
    await newListing.save();
    req.flash("success" ,"New Listing created!!");
    res.redirect("/Listings") ;
}

module.exports.renderEditForm = async(req,res) =>{
    let { id } = req.params ;
    const listing = await Listing.findById(id) ;
    if(!listing){
        req.flash("error" ,"Listing you requested does not exits!!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url ;
    if (originalImageUrl.includes("res.cloudinary.com")) {
        originalImageUrl = originalImageUrl.replace(
            "/upload/",
            "/upload/h_300,w_250/"
        );
    }else if (originalImageUrl.includes("images.unsplash.com")) {
        originalImageUrl = originalImageUrl.replace(
            "w=800",
            "w=250"
        );
    }

    // originalImageUrl = originalImageUrl.replace("/upload" ,"/upload/w_250") ;
    console.log(listing.image.url);
    console.log(originalImageUrl);
    res.render("listings/edit.ejs",{ listing , originalImageUrl }) ;
}

module.exports.updateListing = async(req,res) =>{
    let {id} = req.params ;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing})  ;

    // upadte new uploaded image 
    if(typeof req.file != "undefined"){
        let url = req.file.path ;
        let filename = req.file.filename ;
        listing.image = { url,filename };
        await listing.save() ;
    }
    req.flash("success" ,"Listing Updeted!!");
    res.redirect(`/Listings/${id}`) ;
}

module.exports.destroyListing = async(req,res) =>{
    let { id } = req.params ;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing) ;
    req.flash("success" ,"Listing Deleted!!");
    res.redirect("/Listings") ;
}