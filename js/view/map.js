var markers = {};
var map;
var icons = {};

var initPos = {
	"swamp": {
		"lat": 44.781,
		"lng": 10.717520,
		"zoom": 12
	},
	"default": {
		"lat": 44.50265,
		"lng": 11.3701,
		"zoom": 18
	},
	"arces": {
		"lat": 44.4948,
		"lng": 11.3425,
		"zoom": 15
	},
	"vaimee": {
		"lat": 44.50265,
		"lng": 11.3701,
		"zoom": 18
	}
}

function initMarkers() {
	var vaimee = L.icon({
		iconUrl: 'icon/favicon.svg',
		iconSize: [36, 36]
	});

	icons["https://vaimee.it/monas#Vaimee"] = vaimee;
}

function initMap(context) {
	if (initPos[context] != undefined) {
		map = L.map('mapid').setView([initPos[context]["lat"], initPos[context]["lng"]], initPos[context]["zoom"]);
	}
	else {
		map = L.map('mapid').setView([initPos["default"]["lat"], initPos["default"]["lng"]], initPos["default"]["zoom"]);
	}

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1,
		accessToken: 'pk.eyJ1IjoibHJvZmZpYSIsImEiOiJjanhiZjVxemkwYzZlM3pvODZjcGJlYjdtIn0.cD3reeNMoDGpiRBDTHn5_w'
	}).addTo(map);


	// Init markers
	initMarkers();
}

function onAddedMapPlace(places) {
	for (binding of places) {
		place = binding.root.value;
		name = binding.name.value;
		lat = parseFloat(binding.lat.value.replace(",", "."));
		lng = parseFloat(binding.long.value.replace(",", "."));

		add_marker(lat, lng, name, place);
	}
}

function onRemovedMapPlace(removedResults) {
	for (binding of places) {
		binding = removedResults.results.bindings[index];

		place = binding.root.value;

		remove_marker(place);
	}
}

function add_marker(lat, lng, name, id) {
	if (placeIds[id] === undefined) placeIds[id] = generateID();

	if (icons[id] != undefined) {
		var marker = L.marker([lat, lng], { "title": name, "icon": icons[id] }).addTo(map);
	}
	else {
		var marker = L.marker([lat, lng], { "title": name, }).addTo(map);
	}

	markers[id] = {};
	markers[id]["name"] = name;
	markers[id]["uri"] = id;
	markers[id]["marker"] = marker;

	markers[id]["marker"].on('click', function() {
		onMapPlaceClick(id, name, lat, lng)
	});
}

function remove_marker(id) {
	markers[id].marker.removeFrom(map);

	delete placeIds[markers[id].uri];

	delete markers[id];
}