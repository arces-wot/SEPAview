lastPlaceZone = undefined;

function onLoad() {
	initSepa();
	initMap("vaimee");
	queryMapPlaces();
	queryFoiCount();
	$("#superset").hide();
}

function onMapPlaceClick(uri, name, lat, long) {
	queryPlaceTree(uri, name).then((tree) => {
		createObservationsTree(tree);
	});

	lastPlaceZone = tzlookup(parseFloat(lat), parseFloat(long));

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
		$("#timeZone").html("Time zone: " + moment.tz.guess());
	}
	else {
		$("#timeZone").html("Time zone: " + obsTz);
	}
}