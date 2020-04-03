var express    = require("express"),
 	mongoose   = require("mongoose"),
 	bodyParser = require("body-parser"),
 	app        = express();	

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

// Campground Schema setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String
});

//Create model of campgroundSchema
var Campground = mongoose.model("Campground",campgroundSchema);

// Route for rendering the home page 
app.get('/',function (req,res){
	res.render('landing');
});

// Route for rendering the 'all campgrounds' page 
app.get("/campgrounds",function(req,res){
	// Fnd all campgrounds and pass the data to the campgrounds view
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err)
		}
		else{
			res.render('campgrounds',{campgrounds:allCampgrounds});
		}
	});	
});

// Route for adding a new campground
app.get("/campgrounds/new",function(req,res){
	res.render("new");
});

// Route for adding the new campground to the DB and rendering campgrounds page with new campground added
app.post("/campgrounds",function (req,res){
	// Extract data from the body of the input given by the user
	var name = req.body.name;
	var img = req.body.img;
	var newCampground = {name:name,image:img};
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

// App listens on port 8000
app.listen(8000,function(){
	console.log("Server started!");
});