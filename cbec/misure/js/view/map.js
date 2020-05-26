var placeIds = {};
var markers = {};
var map ;
var icons = {};

var initPos = {
		"swamp" : {
			"lat" : 44.698701,
			"lng" : 10.626607,
			"zoom" : 14
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
		}
}

function initMap(context) {
	if (initPos[context] != undefined) {
		map = L.map('mapid').setView([initPos[context]["lat"],initPos[context]["lng"]], initPos[context]["zoom"]);
	}
	else {
		map = L.map('mapid').setView([initPos["default"]["lat"],initPos["default"]["lng"]], initPos["default"]["zoom"]);
	}
	
	
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mapbox.streets',
	    accessToken: 'pk.eyJ1IjoibHJvZmZpYSIsImEiOiJjanhiZjVxemkwYzZlM3pvODZjcGJlYjdtIn0.cD3reeNMoDGpiRBDTHn5_w'
	}).addTo(map);
	
	// Init markers
	initMarkers();
	
	// Draw layers
	drawVectorLayers();
}

function onAddedMapPlace(places) {
	for (binding of places) {
        place = binding.root.value;
        name = binding.name.value;
        lat = parseFloat(binding.lat.value.replace(",","."));
        lng = parseFloat(binding.long.value.replace(",","."));

        add_marker(lat,lng,name,place);
    }	
}

function onRemovedMapPlace(removedResults) {
	for (binding of places) {
        binding = removedResults.results.bindings[index];

        place = binding.root.value;

        remove_marker(place); 
    }
}

function initMarkers() {
	var swamp = L.icon({
	    iconUrl: 'icon/swamp.png',
	    iconSize: [48, 48]
	});
	
	var server = L.icon({
	    iconUrl: 'icon/server.svg',
	    iconSize: [48, 48]
	});
	
	var wheel = L.icon({
	    iconUrl: 'icon/wheel.png',
	    iconSize: [24, 24]
	});
	
	icons["http://swamp-project.org/ns#Bertacchini"] = swamp;
	icons["http://swamp-project.org/ns#Ferrari"] = swamp;
	icons["http://swamp-project.org/ns#Bonacini"] = swamp;
	icons["http://swamp-project.org/ns#Guaspari"] = swamp;
	
	icons["http://wot.arces.unibo.it/monitor#Star"] = server;
	icons["http://wot.arces.unibo.it/monitor#Mars"] = server;
	
	//icons["http://wot.arces.unibo.it/monitor#ParatoiaSanMichele"] = wheel;
	icons["http://wot.arces.unibo.it/monitor#SanMichele"] = wheel;
	icons["http://wot.arces.unibo.it/monitor#DiramazioneSanMichele"] = wheel;
	icons["http://wot.arces.unibo.it/monitor#FosdondoSud"] = wheel;
	icons["http://wot.arces.unibo.it/monitor#FosdondoNord"] = wheel;
	icons["http://wot.arces.unibo.it/monitor#CanaleSanMichele"] = wheel;
	icons["http://wot.arces.unibo.it/monitor#FosdondoDirezioneSud"] = wheel;
	icons["http://wot.arces.unibo.it/monitor#DiramazioneFosdono"] = wheel;
	icons["http://wot.arces.unibo.it/monitor#SbarramentoFosdondo"] = wheel;
	icons["http://wot.arces.unibo.it/monitor#ScaricoCanaleFosdondo"] = wheel;
	icons["http://wot.arces.unibo.it/monitor#ValleSbarramentoFosdondoDirNord"] = wheel;
}

function drawVectorLayers() {
	initCanals();
	for (canal of canals) L.polyline(canal["vertexes"], {color: canal["color"]}).addTo(map);
}

function add_marker(lat, lng, name, id) {
	if (placeIds[id] === undefined) placeIds[id] = generateID();
	
	if (icons[id] != undefined) {
		var marker = L.marker([lat, lng],{"title": name,"icon" : icons[id]}).addTo(map);
	}
	else {
		var marker = L.marker([lat, lng],{"title": name,}).addTo(map);
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