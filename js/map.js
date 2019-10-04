var placeIds = {};
var markers = {};
var map ;
var icons = {};

function initMap() {	
	// Bologna
	//map = L.map('mapid').setView([44.494048,11.343391], 13);
	
	var lat = localStorage.getItem('lat');
	var long = localStorage.getItem('long');
	
	/*viene previsto il caso in cui ci sono due radici differenti che vengono selezionate
	in questo caso viene presa in considerazione l'ultima selezionata*/

	if(lat != null || long != null)	//se non sono presenti dati
	{
		map = L.map('mapid').setView([lat,long], 15);	//zoom su lat/long che determino io con i dati appena ricavati
		//alert(lat);
		localStorage.removeItem('lat');
		localStorage.removeItem('long');	/*rimuovo le due variabili dall'oggetto, se ricarico la pagina 
											la mappa non sarà zoomata sul nodo precedentemente selezionata*/
	}else{
		// Bertacchini
		map = L.map('mapid').setView([44.776585,10.717520], 15);
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
	
	// PREFIXES
	prefixes = "";
	for (ns in jsap["namespaces"]) {
		prefixes += " PREFIX " + ns + ":<" + jsap["namespaces"][ns]
				+ ">";
	}
	
	query = prefixes + " "
	+ jsap["queries"]["MAP_PLACES"]["sparql"];

	const sepa = Sepajs.client;
	
	let places = sepa.subscribe(query,jsap);
	places.on("added",addedResults=>{
		added = addedResults["results"]["bindings"].length;
		for (index = 0; index < added; index++) {
            binding = addedResults.results.bindings[index];

            place = binding.root.value;
            name = binding.name.value;
            lat = parseFloat(binding.lat.value.replace(",","."));
            lng = parseFloat(binding.long.value.replace(",","."));

            add_marker(lat,lng,name,place);
        }
		if (added > 0) refreshMap();
	});
	
	places.on("removed",removedResults=>{
		removed = removedResults["results"]["bindings"].length;
		for (index = 0; index < removed; index++) {
            binding = removedResults.results.bindings[index];

            place = binding.root.value;

            remove_marker(place); 
        }

        if (removed > 0) refreshMap();	
	});
}

function initMarkers() {
	var leaf = L.icon({
	    iconUrl: 'icon/Hoja.png',
	    iconSize: [48, 48]
	});
	
	icons["http://swamp-project.org/ns#Bertacchini"] = leaf;
	icons["http://swamp-project.org/ns#Ferrari"] = leaf;
	icons["http://swamp-project.org/ns#Bonacini"] = leaf;
}

function drawVectorLayers() {
	var latlngs = [
	    [[44.774522,10.723393],
	     [44.779529, 10.723236],
	     [44.785722, 10.715394],[44.788486,10.708209]]
	];
	
	var polyline = L.polyline(latlngs, {color: 'blue'}).addTo(map);
	// zoom the map to the polyline
	map.fitBounds(polyline.getBounds());
}



function add_marker(lat, lng, name, id) {
	if (placeIds[id] === undefined) placeIds[id] = generateID();
	
	var leaf = L.icon({
	    iconUrl: 'icon/Hoja.png',
	    iconSize: [24, 24]
	});
	
	if (icons[id] != undefined) {
		var marker = L.marker([lat, lng],{"title": name,"icon" : icons[id]}).addTo(map);
		//marker.bindTooltip(name,{"permanent" : true});
	}
	else {
		var marker = L.marker([lat, lng],{"title": name,}).addTo(map);
		//marker.bindTooltip(name,{"permanent" : true});
	}
	
	//TODO:adding marker clustering.
	markers[id] = {};
	markers[id]["name"] = name;
	markers[id]["uri"] = id;
	markers[id]["marker"] = marker;
	
	markers[id]["marker"].on('click', function() {
		createObservationsNav(markers[id].uri,markers[id].name);
	});
}

function remove_marker(id) {
	markers[id].marker.removeFrom(map);
	
	delete placeIds[markers[id].uri];
	
	delete markers[id];
}

function refreshMap() {
//	positions = [];
//	
//	for (id in markers) {
//		positions.push({lat : markers[id].marker.getPosition().lat(), lng : markers[id].marker.getPosition().lng()});	
//	}
//		
//	if (positions.length === 0) {
//		map.setCenter({lat: 44.494048, lng: 11.343391});
//		map.setZoom(13);
//	} else if (positions.length === 1) {
//		map.setCenter(positions[0]);
//	} else {	
//		let neLat = positions[0].lat;
//		let swLat = positions[0].lat;
//
//		let swLng = positions[0].lng;
//		let neLng = positions[0].lng;
//		
//		for (index in positions) {			
//			if (positions[index].lat > neLat) neLat = positions[index].lat;
//			if (positions[index].lat < swLat) swLat = positions[index].lat;
//			
//			if (positions[index].lng > neLng) neLng = positions[index].lng;
//			if (positions[index].lng < swLng) swLng = positions[index].lng;	
//		}
//		
//		let sw = new google.maps.LatLng({lat: swLat, lng: swLng});
//		let ne = new google.maps.LatLng({lat: neLat, lng: neLng});
//		
//		latlngbounds = new google.maps.LatLngBounds(sw,ne);
//		
//		map.fitBounds(latlngbounds);	
//	}
}