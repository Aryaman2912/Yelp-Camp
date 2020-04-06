var express    = require("express"),
 	mongoose   = require("mongoose"),
 	bodyParser = require("body-parser"),
	app        = express(),
	Campground = require("./models/campgrounds"),
	seedDB     = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true,useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
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
			res.render('index',{campgrounds:allCampgrounds});
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
app.get("/campgrounds/new",function(_req,res){
	res.render("new");
});

// SHOW route - display detailed info about a particular campground
app.get("/campgrounds/:id",function(req,res){
	// Identify and get campground which has an id matching the id in the url
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err)
		}
		else{
			res.render("show",{campground:foundCampground})
		}
	});
});

// Campground.create(
// 	{
// 		name: "Visual Bliss",
// 		image: "https://images.unsplash.com/photo-1519395612667-3b754d7b9086?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=460&q=80",
// 		description: "This is a beautiful campground but it has no bathrooms and no water. Enjoy yourself. Enjaay."
// 	},function(err,campground){
// 		if(err){
// 			console.log(err)
// 		}
// 		else{
// 			console.log("Newly created!");
// 			console.log(campground)
// 		}
// 	});

// App listens on port 8000
app.listen(8000,function(){
	console.log("Server started!");
});