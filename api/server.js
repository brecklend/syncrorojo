var express = require("express");
var listings = require("./routes/listings");
var cors = require("./utils/cors");
var app = express();


var server = app.listen(8081, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("listening");
});

app.use(cors());

app.get("/allListings", listings.getAllListings);
app.get("/newListings", listings.getNewListings);
app.get("/trackedListings", listings.getTrackedListings);
app.get("/track/:id", listings.track);
app.get("/ignore/:id", listings.ignore);