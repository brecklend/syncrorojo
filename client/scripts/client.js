var baseUrl = "http://localhost:8081/";
var trackBtn = "<button type='button' onclick='trackListing(this)' class='btn btn-default btn-xs btn-track'><i class='fa fa-check' /></button>";
var ignoreBtn = "<button type='button' onclick='ignoreListing(this)' class='btn btn-default btn-xs btn-ignore'><i class='fa fa-close' /></button>";

$(document).ready(function() {
	getListingsFor("newListings");
	getListingsFor("trackedListings");
	//getListingsFor("allListings");
});

function createCorsReq(method, url) {
	var xhr = new XMLHttpRequest();

	if ("withCredentials" in xhr) {
		xhr.open(method, url, true);
	}
	else if (typeof XDomainRequest != "undefined") {
		xhr = new XDomainRequest();
		xhr.open(method, url);
	}
	else {
		xhr = null;
	}

	return xhr;
}

function apiRequest(operation, callback) {
	var xhr = createCorsReq("GET", baseUrl + operation);

	if (!xhr) {
		console.log("CORS not supported");
		return;
	}

	xhr.onload = function() {
		callback(JSON.parse(xhr.responseText));
	};

	xhr.onerror = function() {
		console.log("failed to track");
	};

	xhr.send();
}

function trackCallback(response) {
	if (response.Success) {
		console.log("successfully tracking listing");
	}
	else {
		console.log(response.Message);
	}
}

function ignoreCallback(response) {
	if (response.Success) {
		console.log("successfully ignored listing");
	}
	else {
		console.log(response.Message);
	}
}

function getListingsFor(listingType) {
	apiRequest(listingType, display);
}

function display(listings) {
	$.each(listings, function(key, val) {
		var id = val.id;
		var url = val.url;
		var title = val.title;
		var price = getMostCurrentItemIn(val.price);
		var location = val.location;
		var city = val.city;
		var state = val.state;
		var postingDatetime = getFirstItemIn(val.datetime);
		var datetime = getMostCurrentItemIn(val.datetime);
		var status = val.status;

		var row = 
			"<tr id='" + id + "'>" +
				"<td>" + getActionButtonsFor(status) + "</td>" +
				"<td><a href='" + url + "'>" + title + "</a></td>" + 
				"<td>$" + price + "</td>" +
				"<td>" + state + "</td>" +
				"<td>" + city + "</td>" +
				"<td>" + location + "</td>" +
				"<td>" + postingDatetime + "</td>" +
			"</tr>";

		switch (status) {
			case "new":
				$("#tbl-new-listings tbody").append(row);
				break;
			case "tracked":
				$("#tbl-new-tracked tbody").append(row);
				break;
		}
	});

	//addButtonListener();
}

function getActionButtonsFor(status) {
	if (status == "new") {
		return trackBtn + " " + ignoreBtn;
	}
	else {
		return ignoreBtn;
	}
}

function getMostCurrentItemIn(ary) {
	if (ary.length <= 0) {
		return null;
	}

	return ary[ary.length - 1];
}

function getFirstItemIn(ary) {
	if (ary.length <= 0) {
		return null;
	}

	return ary[0];
}

function trackListing(btn) {
	var id = $(btn).parent().parent().attr("id");
	apiRequest("track/" + id, trackCallback);
}

function ignoreListing(btn) {
	var id = $(btn).parent().parent().attr("id");
	apiRequest("ignore/" + id, ignoreCallback);	
}