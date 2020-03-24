var placeIds = {};
var markers = {};
var map ;
var icons = {};

var initPos = {
		"swamp" : {
			"lat" : 44.779,
			"lng" : 10.717520,
			"zoom" : 13
		},
		"default" : {
			"lat" : 44.50265,
			"lng" : 11.3701,
			"zoom" : 18
		},
		"arces" : {
			"lat": 44.4948,
			"lng": 11.3425,
			"zoom" : 15
		},
		"italy" : {
			"lat": 42.825,
			"lng": 10.646,
			"zoom" : 5
		}
}

function initMap(context) {
	if (initPos[context] != undefined) {
		map = L.map('mapid').setView([initPos[context]["lat"],initPos[context]["lng"]], initPos[context]["zoom"]);
	}
	else {
		map = L.map('mapid').setView([initPos["default"]["lat"],initPos["default"]["lng"]], initPos["default"]["zoom"]);
	}
	
	
	L.tileLayer('http://{username}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
		username:"relu91",
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
		maxZoom: 18
	}).addTo(map);

}

function onAddedMapPlace(places) {
	for (binding of places) {
        place = binding.place.value;
        name = binding.name.value;
        lat = parseFloat(binding.lat.value.replace(",","."));
        lng = parseFloat(binding.lon.value.replace(",","."));

        add_marker(lat,lng,name,place,parseInt(binding.cases.value));
    }	
}

function onRemovedMapPlace(removedResults) {
	for (binding of places) {
        binding = removedResults.results.bindings[index];

        place = binding.root.value;

        remove_marker(place); 
    }
}
function sigmoid(x){
	return 1/(1 + Math.exp(-x))
}
function add_marker(lat, lng, name, id,cases) {
	if (placeIds[id] === undefined) placeIds[id] = generateID();
	
	if (icons[id] != undefined) {
		var marker = L.marker([lat, lng],{"title": name,"icon" : icons[id]}).addTo(map);
	}
	else {
	
		var radius = 1000*Math.log(cases)*Math.log(cases)
		var marker = L.circle([lat, lng], { "title": name, 
			radius: Math.max(radius,20000),
			stroke: false,
			fillOpacity: 0.2,
			}, 1000).addTo(map);
		L.circle([lat, lng], {
			"title": name,
			radius: 100
		}, 1000).addTo(map).on('click', function () {
			onMapPlaceClick(id, name, lat, lng)
		});
	}
	
	
	markers[id] = {};
	markers[id]["name"] = name;
	markers[id]["uri"] = id;
	markers[id]["marker"] = marker;
	
	markers[id]["marker"].on('click', function() {
		onMapPlaceClick(id,name,lat,lng)
	});
}

function remove_marker(id) {
	markers[id].marker.removeFrom(map);
	
	delete placeIds[markers[id].uri];
	
	delete markers[id];
}