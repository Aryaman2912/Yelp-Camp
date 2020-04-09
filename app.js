var express       = require("express"),
 	mongoose      = require("mongoose"),
	bodyParser    = require("body-parser"),
	passport      = require("passport"),
	LocalStrategy = require("passport-local") 
	app           = express(),
	Campground    = require("./models/campgrounds"),
	seedDB        = require("./seeds"),
	Comment       = require("./models/comments"),
	User          = require("./models/users");

//App config
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true,useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"))
seedDB();

//Auth config
app.use(require("express-session")({
	secret: "I like web development",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
})
// Route for rendering the home page 
app.get('/',function (req,res){
	res.render('landing');
});

// INDEX route - display all campgrounds in DB
app.get("/campgrounds",function(req,res){
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

app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err)
		}
		else{
			res.render("comments/new",{campground:campground})
		}
	});
});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
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

//Auth routes
app.get("/register",function(req,res){
	res.render("register")
});

app.post("/register",function(req,res){
	var newUser = new User({username: req.body.username})
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err)
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/campgrounds");
		});

	});

});

app.get("/login",function(req,res){
	res.render("login");
});

app.post("/login",passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}),function(req,res){

});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/campgrounds")
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		return res.redirect("/login");
	}
}
// App listens on port 8000
app.listen(8000,function(){
	console.log("Server started!");
});