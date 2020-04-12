var express = require("express"),
    router  = express.Router({mergeParams:true}),
    Campground = require("../models/campgrounds"),
	Comment = require("../models/comments");
	middleware = require("../middleware");

//NEW Route - Add new comment form
router.get("/new",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err)
		}
		else{
			res.render("comments/new",{campground:campground})
		}
	});
});

//CREATE Route - Create comment from form data
router.post("/",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			req.flash("error","Campground not found")
			res.redirect("/campgrounds")
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error","Something went wrong")
					res.redirect("/comments/new");
				}
				else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success","Successfully added comment")
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

//EDIT Route - Renders the edit form
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back");
		}
		else{

			res.render("comments/edit",{campground_id:req.params.id,comment:foundComment})
		}
	});
});

//UPDATE Route - updates comment in DB
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
		if(err){
			res.redirect("back");
		}
		else{
			req.flash("success","Successfully updatedthe comment")
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DELETE Route - Delete comment
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			req.flash("error","Something went wrong")
			res.redirect("back");
		}
		else{
			req.flash("success","Successfully deleted comment")
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


module.exports = router;