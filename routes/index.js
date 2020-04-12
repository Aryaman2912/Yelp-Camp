var express = require("express");
var router  = express.Router();
var passport  = require("passport");
var User = require("../models/users")

router.get('/',function (req,res){
	res.render('landing');
});

//Register form 
router.get("/register",function(req,res){
	res.render("register")
});

//Registering logic
router.post("/register",function(req,res){
	var newUser = new User({username: req.body.username})
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message)
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to Yelp Camp, " + user.username + "!")
			res.redirect("/campgrounds");
		});

	});

});


//Login form
router.get("/login",function(req,res){
	res.render("login");
});

//Login logic
router.post("/login", function (req, res, next) {
	passport.authenticate("local",
	  {
		successRedirect: "/campgrounds",
		failureRedirect: "/login",
		failureFlash: "Username or password is incorrect",
		successFlash: "Successfully logged in, " + req.body.username + "!"
	  })(req, res);
  });

//Logout route
router.get("/logout",function(req,res){
	req.flash("success","Logged you out")
	req.logout();
	res.redirect("/campgrounds")
});




module.exports = router;