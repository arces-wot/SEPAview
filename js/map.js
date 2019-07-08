var placeIds = {};
var markers = {};
var map ;

function initMap() {
//	map = new google.maps.Map(document.getElementById('map'), {
//		center : {lat : 44.494048, lng :  11.343391},
//		zoom : 13,
//		zoomControl: true,
//        scaleControl: true,
//        draggable: true,
//	    scrollwheel: true,
//	    panControl: true,
//	});
	
	map = L.map('mapid').setView([44.494048,11.343391], 13);
	
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mapbox.streets',
	    accessToken: 'pk.eyJ1IjoibHJvZmZpYSIsImEiOiJjanhiZjVxemkwYzZlM3pvODZjcGJlYjdtIn0.cD3reeNMoDGpiRBDTHn5_w'
	}).addTo(map);
	
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

// IMPORTANT: the URI can be used as identifier, not the name
function add_marker(lat, lng, name, id) {
	if (placeIds[id] === undefined) placeIds[id] = generateID();
	
	var marker = L.marker([lat, lng],{"title": name}).addTo(map);
//	marker.bindPopup("<b>"+name+"</b>");
	marker.bindTooltip(name,{"permanent" : true});
	
//	//TODO:adding marker clustering.
//
	markers[id] = {};
	markers[id]["name"] = name;
	markers[id]["uri"] = id;
	markers[id]["marker"] = marker;
	
//	markers[id]["marker"] = new google.maps.Marker({
//		position : {
//			lat : lat,
//			lng : lng
//		},
//		title : name,
//		label: {
//			text: name,
//            color: '#234d78',
//            fontSize: "15px",
//            fontWeight: "bold",
//            fontFamily: "Montserrat",
//		},
//		animation : google.maps.Animation.DROP,
//		icon : {
//			url: 'http://mml.arces.unibo.it/apps/sepaview2/images/rdf_icon32.png',
//			labelOrigin : new google.maps.Point(40,40)
//		},
//		map : map
//	});
//
//	
	
//	
	markers[id]["marker"].on('click', function() {
//		$('#tree').empty();
		//createTree(markers[id].uri, "#tree", 0);
		createObservationsNav(markers[id].uri,markers[id].name);
	});
}

function remove_marker(id) {
	markers[id].marker.removeFrom(map);
	
	delete placeIds[markers[id].uri];
	
	delete markers[id];
}