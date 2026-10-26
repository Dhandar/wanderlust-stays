const express = require("express") ;
const router = express.Router() ;
const wrapAsync = require("../utils/wrapAsync.js") ;
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema  } = require("../schema.js")
const Listing  = require("../models/listing.js") ;
const  { isLoggedIn , isOwner , validateListing } = require("../middleware.js") ;
// require controllers
const listingsController = require("../controllers/listings.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router
    .route("/")
    // Index Route
    .get(wrapAsync(listingsController.index))
    // Create Route 
    // .post(
    //     isLoggedIn ,
    //     validateListing , 
    //     wrapAsync(listingsController.createListing)
    // );
    .post(upload.single("listing[image]") ,(req,res) =>{
        console.log(req.file);
        res.send(req.file);
    })

    

// CREATE(new & create route ) - New Route
router.get("/new",isLoggedIn ,listingsController.renderNewForm);


router
    .route("/:id")
    // Show Route(READ)
    .get(wrapAsync(listingsController.showListing))
    // Update route
    .put(
        isLoggedIn , 
        isOwner , 
        validateListing , 
        wrapAsync(listingsController.updateListing)
    )
    .delete(
        isLoggedIn ,
        isOwner , 
        wrapAsync(listingsController.destroyListing)
    );


// Edit Route
router.get(
    "/:id/edit" , 
    isLoggedIn , 
    isOwner , 
    wrapAsync(listingsController.renderEditForm)
);



//  export route 
module.exports = router ;