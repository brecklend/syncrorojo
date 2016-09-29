var html = 
	'<ul>' +
  		'<li><strong>list</strong> item 1 - one strong tag</li>' +
  		'<li><strong>list</strong> item <strong>2</strong> - two <span>strong tags</span></li>' +
  		'<li>list item 3</li>' +
  		'<li>list item 4</li>' +
  		'<li>list item 5</li>' +
  		'<li>list item 6</li>' +
	'</ul>';

// $('li').filter(function(index) {
// 	return $('strong', this).length === 1;
// }).css('background-color', 'red');

function forEach(array, action) {
	for(var i = 0; i < array.length; i++) {
		action(array[i]);
		//function(array[i]) { v += n;}
	}
}

var data = [
	{
		"State": {
			"Name": "Alaska",
			"Cities": [
				{
					"Name": "anchorage / mat-su",
					"Url": "http://anchorage.craigslist.org/"
				},
				{
					"Name": "fairbanks",
					"Url": "http://fairbanks.craigslist.org/"
				},
				{
					"Name": "kenai peninsula",
					"Url": "http://kenai.craigslist.org/"
				},
				{
					"Name": "southeast alaska",
					"Url": "http://juneau.craigslist.org/"
				}
			]
		}
	},
	{
		"State": {
			"Name": "California",
			"Cities": [
				{
					"Name": "bakersfield",
					"Url": "http://bakersfield.craigslist.org/"
				},
				{
					"Name": "chico",
					"Url": "http://chico.craigslist.org/"
				}
			]
		}
	},
	{
		"State": {
			"Name": "Oregon",
			"Cities": [
				{
					"Name": "bend",
					"Url": "http://bend.craigslist.org/"
				},
				{
					"Name": "corvallis/albany",
					"Url": "http://corvallis.craigslist.org/"
				},
				{
					"Name": "east oregon",
					"Url": "http://eastoregon.craigslist.org/"
				}
			]
		}
	}
];

data.forEach(function(item) {
	var stateName = item.State.Name;
	console.log("stateName", stateName);
	var cities = item.State.Cities;

	cities.forEach(function(cityItem) {
		var cityName = cityItem.Name;
		console.log("cityName:", cityName);
	});
});