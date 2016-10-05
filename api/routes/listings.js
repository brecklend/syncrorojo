var fs = require("fs");

exports.getAll = function(req, res) {
	res.send(listings);
};

exports.getNew = function(req, res) {
	res.send(getListingsFor("new"));
};

exports.getTracked = function(req, res) {
	res.send(getListingsFor("tracked"));
};

exports.track = function(req, res) {
	res.send();
};

exports.ignore = function(req, res) {
	res.send();
};

var listings = [
	{
		"id": 1,
		"title": "one",
		"status": "new"
	},
	{
		"id": 2,
		"title": "two",
		"status": "tracked"
	},
	{
		"id": 3,
		"title": "three",
		"status": "ignore"
	}
];

function getListingsFor(statusType) {
	var list = [];

	for (var i = 0; i < listings.length; i++) {
		if (listings[i].status == statusType) {
			list.push(listings[i]);
		}
	}

	return list;
}