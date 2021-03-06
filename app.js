
var express        = require("express"),
 	mongoose       = require("mongoose"),
	bodyParser     = require("body-parser"),
	passport       = require("passport"),
	LocalStrategy  = require("passport-local"),
	methodOverride = require("method-override"),
	flash          = require("connect-flash"),
	app            = express(),
	Campground     = require("./models/campgrounds"),
	Comment        = require("./models/comments"),
	User           = require("./models/users");


var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes    = require("./routes/comments"),
	indexRoutes      = require("./routes/index")

//App config
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true,useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Auth config
app.use(require("express-session")({
	secret: "I like web development",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success")
	next();
})

//Requiring routes
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
// App listens on port 8000
app.listen(8000,function(){
	console.log("Server started!");
});