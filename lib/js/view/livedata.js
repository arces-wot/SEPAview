
sensorData = {};

notifications = [ {
	"title" : "Notifications",
	"subtitle" : "(Added bindings)",
	"place" : "",
	"quantity" : ""
} ];

nots = 0;

function onObservation(binding) {
	//console.log("onObservation "+binding)
	
	// FOI
	let foi = binding.foi.value;
	
	// OBSERVED PROPERTY
	let label = binding.label.value; //observed property label
	let prop = binding.prop.value; //observed property is the URI
	
	let name = binding.name.value;
	let lat = binding.lat.value;
	let long = binding.long.value;
	let symbol = (binding.symbol != undefined ? binding.symbol.value : "qudt-unit?");
	
	let value = binding.value ? binding.value.value : "???";
	
	//console.log("onObservation FOI:"+foi+" Observed property:"+prop+" value:"+value)
	
	if (binding.timestamp != undefined) {
		timestamp = binding.timestamp.value;
	} else {
		let date = new Date();
		timestamp = date.toLocaleString();
	}

	// NEW PLACE
	if (sensorData[foi] === undefined) {
		sensorData[foi] = {};

		if (placeIds[foi] === undefined) {
			placeIds[foi] = generateID();
		}
		sensorData[foi]["div_id"] = placeIds[foi];

		addPlace(sensorData[foi]["div_id"]);
	}

	// NEW OBSERVATION
	if (sensorData[foi][prop] === undefined) {
		sensorData[foi][prop] = {};
		sensorData[foi][prop]["div_id"] = generateID();
		
		sensorData[foi][prop]["placeUri"] = foi;
		sensorData[foi][prop]["placeName"] = name;
		sensorData[foi][prop]["lat"] = lat;
		sensorData[foi][prop]["long"] = long;
		sensorData[foi][prop]["zoneName"] = tzlookup(parseFloat(lat),parseFloat(long));
		
		sensorData[foi][prop]["title"] = label;
		sensorData[foi][prop]["symbol"] = (symbol != null ? symbol : "qudt-unit?");
		sensorData[foi][prop]["value"] = value;
		sensorData[foi][prop]["timestamp"] = timestamp;
				
		addObservation(prop,foi);
	}

	sensorData[foi][prop]["value"] = value;
	sensorData[foi][prop]["timestamp"] = timestamp;
	
	// UPDATE data
	updateObservation(prop,foi);
}

function addPlace(place_id) {
	$("#graph")
			.append(
					"<div class='tab-pane fade' id='"+ place_id + "' role='tabpanel' aria-labelledby='"+ place_id+ "-tab'>"
					+ "<div id='live_"+ place_id+ "'></div>"
					+ "</div>");
}

function addObservation(prop, foi) {
	let obs_id = sensorData[foi][prop]["div_id"];

	
	layout = "<div class='container'><div class='row align-items-center mb-3'>"
	+ "<div class='col'><p class='font-weight-bold'>" 
	+ sensorData[foi][prop]["title"]
	+ "</p></div>"
	
	+ "<div class='col-auto'>" 
	+ "<button type='button' class='btn btn-success' id='value_+"+ obs_id+ "'>"
	+ "<span class='badge badge-light' id='value_"+ obs_id+ "'>---</span>&nbsp;"
	+ sensorData[foi][prop]["symbol"]
	+ "<span class='badge badge-light ml-3' id='timestamp_"+ obs_id + "'>---</span>"
	+ "</button>"
	+ "</div>"
	
	+ "<div class='col-auto'>"
	+ "<form target='_blank' action='./history.html'>"
		+ "<input class='form-control form-control-sm' type='hidden' name='property' value=\""+ prop+ "\" />"
		+ "<input class='form-control form-control-sm' type='hidden' name='foi' value=\"" + foi + "\" />"
		+ "<input class='form-control form-control-sm' type='hidden' name='lat' value=\"" + escape(sensorData[foi][prop]["lat"]) + "\" />"
		+ "<input class='form-control form-control-sm' type='hidden' name='long' value=\"" + escape(sensorData[foi][prop]["long"]) + "\" />"
		+ "<input class='form-control form-control-sm' type='hidden' name='symbol' value='" + escape(sensorData[foi][prop]["symbol"])+ "' />"
		+ "<input class='form-control form-control-sm' type='hidden' name='title' value='" + escape(sensorData[foi][prop]["title"])+ "' />"
		+ "<input class='form-control form-control-sm' type='hidden' name='placeName' placeId='"+placeIds[foi]+"' value='???' />"
		+ "<button class='btn btn-primary float-right' type='submit'><small><i class='fas fa-external-link-alt'></i>&nbsp;History</small></button>"
	+ "</form></div>"
	
	+ "</div></div>"
	
	$("#live_" + sensorData[foi]["div_id"]).append(layout);	
}

function updateLiveDataTimestamps(tz) {	
	for (place in sensorData) {
		for (observation in sensorData[place]) {
			if (observation == "div_id") continue;
			
			let obs_id = sensorData[place][observation]["div_id"];
			let timestamp = sensorData[place][observation]["timestamp"];
			
			if (tz == "UTC") {
				time = moment(timestamp).utc()
			}
			else if (tz == "Local") {
				time = moment(timestamp)
			}
			else {
				zone = sensorData[place][observation]["zoneName"];
				if (zone == "America/Sao_Paulo") {
					zone = "America/Belem"
				}
				time = moment(timestamp).utc().tz(zone);
			}
			
			$("#timestamp_" + obs_id).html(time.format("LLL"));
		}
	}
}

function updateObservation(observation, place) {
	let obs_id = sensorData[place][observation]["div_id"];
	
	value = sensorData[place][observation]["value"];
	timestamp = sensorData[place][observation]["timestamp"];

	tz = document.getElementById("selectTimeZone").value;
	
	if (tz == "UTC") {
		time = moment(timestamp).utc()
	}
	else if (tz == "Local") {
		time = moment(timestamp)
	}
	else {
		zone = sensorData[place][observation]["zoneName"];
		if (zone == "America/Sao_Paulo") {
			zone = "America/Belem"
		}
		time = moment(timestamp).utc().tz(zone);
	}
		
	$("#timestamp_" + obs_id).html(time.format("LLL"));
	$("#value_" + obs_id).html(value);
}