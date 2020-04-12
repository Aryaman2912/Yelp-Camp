var Campground = require("../models/campgrounds");
var Comment = require("../models/comments")

var middlewareObj = {}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        req.flash("success","You need to be logged in to do that");
        return res.redirect("/login");
    }
}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                req.flash("error","Campground not found")
                res.redirect("back");
            }
            else{
                if(foundCampground.author.id.equals(req.user._id)){
                    return next();
                } else{
                    req.flash("error","You don't have permission to do that")
                    res.redirect("back")
                }	
            }
        });
    }
    else{
        req.flash("error","You need to be logged in to do that")
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                req.flash("error","You don't have permission to do that");
                res.redirect("back");
            }
            else{
                if(foundComment.author.id.equals(req.user._id)){
                    return next();
                } else{
                    res.redirect("back")
                }	
            }
        });
    }
    else{
        req.flash("error","You need to be logged in to do that")
        res.redirect("back");
    }
}


module.exports = middlewareObj;
