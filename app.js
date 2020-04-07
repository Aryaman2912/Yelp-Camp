var express    = require("express"),
 	mongoose   = require("mongoose"),
 	bodyParser = require("body-parser"),
	app        = express(),
	Campground = require("./models/campgrounds"),
	seedDB     = require("./seeds");
	Comment    = require("./models/comments")

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true,useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"))
seedDB();


// Route for rendering the home page 
app.get('/',function (req,res){
	res.render('landing');
});

// INDEX route - display all campgrounds in DB
app.get("/campgrounds",function(_req,res){
	// Fnd all campgrounds and pass the data to the campgrounds view
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err)
		}
		else{
			res.render('campgrounds/index',{campgrounds:allCampgrounds});
		}
	});	
});

// CREATE route - add new campground to DB
app.post("/campgrounds",function (req,res){
	// Extract data from the body of the input given by the user
	var name = req.body.name;
	var img = req.body.img;
	var desc = req.body.description;
	var newCampground = {name:name,image:img,description:desc};
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
app.get("/campgrounds/new",function(req,res){
	res.render("campgrounds/new");
});

// SHOW route - display detailed info about a particular campground
app.get("/campgrounds/:id",function(req,res){
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

app.get("/campgrounds/:id/comments/new",function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err)
		}
		else{
			res.render("comments/new",{campground:campground})
		}
	});
});

app.post("/campgrounds/:id/comments",function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			res.redirect("/campgrounds")
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					res.redirect("/comments/new");
				}
				else{
					campground.comments.push(comment)
					campground.save();
					res.redirect("/campgrounds/" + campground._id)
				}
			});
		}
	});
});
// App listens on port 8000
app.listen(8000,function(){
	console.log("Server started!");
});