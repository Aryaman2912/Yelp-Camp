var express = require("express"),
    router  = express.Router({}),
    Campground = require("../models/campgrounds")
	Comment = require("../models/comments")
	middleware = require("../middleware")

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
router.post("/",middleware.isLoggedIn,function (req,res){
	// Extract data from the body of the input given by the user
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id : req.user._id,
		username: req.user.username
	};
	var newCampground = {name:name,image:image,description:desc,author:author};
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
router.get("/new",middleware.isLoggedIn,function(req,res){
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

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,foundCampground){
		res.render("campgrounds/edit",{campground:foundCampground});
	});
});

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,foundCampground){
		if(err){
			req.flash("error","Campground not found")
			res.redirect("/campgrounds")
		}
		else{
			req.flash("success","Successfully updated")
			res.redirect("/campgrounds/" + req.params.id)
		}
	});
});

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			req.flash("error","Campground not found")
			res.redirect("/campgrounds")
		}
		else{
			req.flash("success","Successfully deleted campground")
			res.redirect("/campgrounds")
		}
	})
})

module.exports = router;