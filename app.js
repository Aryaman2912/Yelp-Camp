var express = require('express');
var bodyParser = require("body-parser");
var app = express();	

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

var campgrounds = [
		{name: "Salmon Creek",image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=459&q=80"},
		{name: "Granite Hill",image: "https://images.unsplash.com/photo-1552522060-ab53cefef28e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=459&q=80"},
		{name: "Mountain Goat's Rest",image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=459&q=80.jpg"},
		{name: "Salmon Creek",image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=459&q=80"},
		{name: "Granite Hill",image: "https://images.unsplash.com/photo-1552522060-ab53cefef28e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=459&q=80"},
		{name: "Mountain Goat's Rest",image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=459&q=80.jpg"},
	]

app.get('/',function (req,res){
	res.render('landing')
});

app.get("/campgrounds",function(req,res){
	
	res.render('campgrounds',{campgrounds:campgrounds});
})

app.post("/campgrounds",function (req,res){
	var name = req.body.name;
	var img = req.body.img;
	var newCampground = {name:name,image:img};
	campgrounds.push(newCampground);
	res.render("campgrounds",{campgrounds:campgrounds});
});

app.get("/campgrounds/new",function(req,res){
	res.render("new")
})

app.listen(8000,function(){
	console.log("Server started!");
});