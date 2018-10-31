var placeIds = {};
var markers = {};
var map ;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center : {lat : 44.494048, lng :  11.343391},
		zoom : 13,
		zoomControl: false,
        scaleControl: false
	});
	
	const Jsap = Sepajs.Jsap
	
	app = new Jsap(jsap);
	
	app.MAP_PLACES({},data => {
		msg = JSON.parse(data);
		
		if (msg["notification"] !== undefined) {
            added = msg["notification"]["addedResults"]["results"]["bindings"].length;
            removed = msg["notification"]["removedResults"]["results"]["bindings"].length;
            
            for (index = 0; index < added; index++) {
                binding = msg.notification.addedResults.results.bindings[index];

                place = binding.root.value;
                name = binding.name.value;
                lat = parseFloat(binding.lat.value);
                lng = parseFloat(binding.long.value);

                add_marker(lat,lng,name,place);
            }
            
            for (index = 0; index < removed; index++) {
                binding = msg.notification.removedResults.results.bindings[index];

                place = binding.root.value;

                remove_marker(place); 
            }

            if (added > 0 || removed > 0) refreshMap();
        }
	});
}

function refreshMap() {
	positions = [];
	
	for (id in markers) {
		positions.push({lat : markers[id].marker.getPosition().lat(), lng : markers[id].marker.getPosition().lng()});	
	}
		
	if (positions.length == 0) {
		map.setCenter({lat: 44.494048, lng: 11.343391});
		map.setZoom(13);
	} else if (positions.length == 1) {
		map.setCenter(positions[0]);
	} else {	
		let neLat = positions[0].lat;
		let swLat = positions[0].lat;

		let swLng = positions[0].lng;
		let neLng = positions[0].lng;
		
		for (index in positions) {			
			if (positions[index].lat > neLat) neLat = positions[index].lat;
			if (positions[index].lat < swLat) swLat = positions[index].lat;
			
			if (positions[index].lng > neLng) neLng = positions[index].lng;
			if (positions[index].lng < swLng) swLng = positions[index].lng;	
		}
		
		let sw = new google.maps.LatLng({lat: swLat, lng: swLng});
		let ne = new google.maps.LatLng({lat: neLat, lng: neLng});
		
		latlngbounds = new google.maps.LatLngBounds(sw,ne);
		
		map.fitBounds(latlngbounds);	
	}
}

// IMPORTANT: the URI can be used as identifier, not the name
function add_marker(lat, lng, name, id) {
	markers[id] = {};
	markers[id]["name"] = name;
	markers[id]["uri"] = id;
	markers[id]["marker"] = new google.maps.Marker({
		position : {
			lat : lat,
			lng : lng
		},
		title : name,
		animation : google.maps.Animation.DROP,
		icon : 'images/database24.png',
		map : map
	});
	
	if (placeIds[place] == undefined) placeIds[place] = generateID();
	
	markers[id]["marker"].addListener('click', function() {
		$('#tree').empty();

		createTree(markers[id].uri, "#tree");
	});
}

function remove_marker(id) {
	markers[id].marker.setMap(null);
	
	delete placeIds[markers[id].uri];
	
	delete markers[id];
}