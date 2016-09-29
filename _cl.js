
exports.BuildClSearchUrl = function(cityUrl) {
	/*<<<DEV>>>*/ return "http://localhost/cl/results.html";
	//return "http://localhost/cl/" + cityUrl.substring(2, cityUrl.indexOf(".")) + ".html";
	return replaceProtocalPrefix(cityUrl) + getUrlSearchString() + getKeywords();
}

function replaceProtocalPrefix(url) {
	return url.replace("//", "http://");
}

function getUrlSearchString() {
	return "search/sss?sort=rel&query=";
}

function getKeywords() {
	return "4wd+van";
}