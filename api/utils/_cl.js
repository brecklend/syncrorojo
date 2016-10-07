
exports.BuildClSearchUrl = function(cityUrl) {
	// //sfbay.craigslist.org/
	// http://sfbay.craigslist.org/
	// http://sfbay.craigslist.org/search/sss?sort=rel&query=
	// http://sfbay.craigslist.org/search/sss?sort=rel&query=4wd+van

	/*<<<DEV>>>*/ //return cityUrl; // "http://localhost/cl/results.html";
	//return "http://localhost/cl/" + cityUrl.substring(2, cityUrl.indexOf(".")) + ".html";
	return replaceProtocalPrefix(cityUrl) + getUrlSearchString() + getKeywords();
}

exports.GetCityUrl = function(url) {
	var url = replaceProtocalPrefix(url);

	//trim last forward slash
	url = url.substr(0, url.length - 1);

	return url;
}



// Helpers ////////////////////////////////////////////////////////////////////
function replaceProtocalPrefix(url) {
	return url.replace("//", "http://");
}

function getUrlSearchString() {
	return "search/sss?sort=rel&query=";
}

function getKeywords() {
	var keywords = new String();

	//keywords = "4wd+van";
	keywords = "pinzgauer";

	return keywords;
}
///////////////////////////////////////////////////////////////////////////////