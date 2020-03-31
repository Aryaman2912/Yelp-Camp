var express = require('express')
var app = express();

app.set("view engine","ejs");

app.get('/',function (req,res){
	res.render('landing')
});

app.get("/campgrounds",function(req,res){
	var campgrounds = [
		{name: "Salmon Creek",image: "https://cdn.pixabay.com/photo/2016/11/21/14/31/vw-bus-1845719_1280.jpg"},
		{name: "Granite Hill",image: "https://cdn.pixabay.com/photo/2016/11/22/23/08/adventure-1851092_1280.jpg"},
		{name: "Mountain Goat's Rest",image: "https://cdn.pixabay.com/photo/2020/01/11/07/39/north-4756774_1280.jpg"}
	]
	res.render('campgrounds',{campgrounds:campgrounds})
})



app.listen(8000,function(){
	console.log("Server started!");
});