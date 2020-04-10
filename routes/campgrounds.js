var express = require("express"),
    router  = express.Router({}),
    Campground = require("../models/campgrounds")
    Comment = require("../models/comments")

// INDEX route - display all campgrounds in DB
router.get("/",function(req,res){
	// Fnd all campgrounds and pass the data to the campgrounds view
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render('campgrounds/index',{campgrounds:allCampgrounds});
		}
	});	
});

// CREATE route - add new campground to DB
router.post("/",isLoggedIn,function (req,res){
	// Extract data from the body of the input given by the user
	var name = req.body.name;
	var img = req.body.img;
	var desc = req.body.description;
	var author = {
		id : req.user._id,
		username: req.user.username
	};
	var newCampground = {name:name,image:img,description:desc,author:author};
	// Create new campground using the data given by the user
	Campground.create(newCampground,function(err,newlyCreated){
		if(err){
			console.log(err)
		}
		else{
			res.redirect("/campgrounds");
		}
	});
});

// NEW route - display form to add new campground
router.get("/new",isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

// SHOW route - display detailed info about a particular campground
router.get("/:id",function(req,res){
	// Identify and get campground which has an id matching the id in the url
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err)
		}
		else{
			res.render("campgrounds/show",{campground:foundCampground})
		}
	});
});

//Middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		return res.redirect("/login");
	}
}

module.exports = router;