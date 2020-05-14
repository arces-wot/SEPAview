lastPlaceZone = undefined;

function onMapPlaceClick(uri, name,lat,long) {
	let today = moment("2019-12-31T08:00:00Z");
	//let today = moment();
	
	queryPlaceTree(uri, name).then((tree)=> {
		createObservationsTree(tree,today);
	});
	
	lastPlaceZone = tzlookup(parseFloat(lat),parseFloat(long));
	
	updateTimeZone(lastPlaceZone);
}

function onChangeTimeZone() {
	var tz = document.getElementById("selectTimeZone").value;
	
	updateLiveDataTimestamps(tz);
	
	updateTimeZone(lastPlaceZone);
}

function updateTimeZone(obsTz) {
	var tz = document.getElementById("selectTimeZone").value;
	
	if (tz == "UTC") {
		$("#timeZone").html("Time zone: UTC");
	}
	else if (tz == "Local") {
		$("#timeZone").html("Time zone: "+moment.tz.guess());
	}
	else {
		$("#timeZone").html("Time zone: "+obsTz);
	}
}

function onChangeHistoryTimeZone() {
	var tz = document.getElementById("selectTimeZone").value;
	
	updateTimeZone(getHistoryPlaceZone());
	
	updateHistoryGraph();
}