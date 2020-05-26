var express    = require('express'),
	app        = express(),
	bodyParser = require("body-parser"),
	mongoose   = require("mongoose")

mongoose.connect("mongodb://localhost/yelp_camp", {   useNewUrlParser: true, //if mongoose is not able to find yelpcamp db then it will create one
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);//through this we binded campgroundSchema into a model/an object through which we can manipulate DBs with methods like Campgrounds.find, Campgrounds.create, etc
/*
Campground.create({
	name: "Granite Hill", 
	image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
	description: "Nice camping site"
}, function(err, campground){
	if(err){
		console.log(err);
	}else{
		console.log("newly created campground: ");
		console.log(campground);
	}
});*/

//

app.get("/", function(req, res){
	res.render("landing");
});

// INDEX show all Campgrounds
app.get("/campgrounds", function(req, res){
	//get all campgrounds from dbs
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("index", {campgrounds: allCampgrounds});
		}
	});
});

//this app.post is done so as to follow REST format
//CREATE add campgrounds to DB
app.post("/campgrounds", function(req, res){
	// retrieve data from the form while submitting
	var name = req.body.name;
	var image =  req.body.image;
	var desc = req.body.description
	var newCampgrounds = {name: name , image: image, description: desc}
	//create a new campground and save to db
	Campground.create(newCampgrounds, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			// redirect the page to campgrounds
			res.redirect("/campgrounds");
		}
	});
}); 
// this one is created to allow user to add new camps
// NEW show form to add new campgrounds by user
app.get("/campgrounds/new", function(req, res){
	res.render("new.ejs");
});

//SHOW shows description about the selected campground
app.get("/campgrounds/:id",function(req, res){
	//find the campground with provided id
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err) {
			console.log(err);
		} else {
			//render show template with the selelcted campground
			res.render("show", {campground: foundCampground});
		}
	});
});
app.listen(3000, function(){
	console.log("YelpCamp app has started!!");
});