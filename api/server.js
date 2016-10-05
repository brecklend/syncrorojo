var express = require("express");
var listings = require("./routes/listings");
var app = express();


var server = app.listen(8081, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("listening");
});


app.get("/getAll", listings.getAll);
app.get("/getNew", listings.getNew);
app.get("/getTracked", listings.getTracked);
app.get("/track/:id", listings.track);
app.get("/ignore/:id", listings.ignore);