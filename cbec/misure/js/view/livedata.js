
sensorData = {};

notifications = [ {
	"title" : "Notifications",
	"subtitle" : "(Added bindings)",
	"place" : "",
	"quantity" : ""
} ];

nots = 0;

function onObservation(binding) {
	let place = binding.location.value;
	let observation = binding.observation.value;
	
	let name = binding.name.value;
	let lat = binding.lat.value;
	let long = binding.long.value;
	
	let value = binding.value ? binding.value.value : "???";
	
	console.log("onObservation Place:"+place+" Observation:"+observation+" value:"+value)
	
	if (binding.timestamp != undefined) {
		timestamp = binding.timestamp.value;
	} else {
		let date = new Date();
		timestamp = date.toLocaleString();
	}

	// NEW PLACE
	if (sensorData[place] === undefined) {
		sensorData[place] = {};

		if (placeIds[place] === undefined) {
			placeIds[place] = generateID();
		}
		sensorData[place]["div_id"] = placeIds[place];

		addPlace(sensorData[place]["div_id"],name,place);
	}

	// NEW OBSERVATION
	if (sensorData[place][observation] === undefined) {
		sensorData[place][observation] = {};
		sensorData[place][observation]["div_id"] = generateID();
		
		sensorData[place][observation]["placeUri"] = place;
		sensorData[place][observation]["placeName"] = name;
		sensorData[place][observation]["lat"] = lat;
		sensorData[place][observation]["long"] = long;
		sensorData[place][observation]["zoneName"] = tzlookup(parseFloat(lat),parseFloat(long));
		
		sensorData[place][observation]["title"] = binding.label.value;
		sensorData[place][observation]["symbol"] = (binding.symbol != null ? binding.symbol.value : "qudt-unit?");
		sensorData[place][observation]["value"] = value;
		sensorData[place][observation]["timestamp"] = timestamp;
				
		addObservation(observation,place);
	}

	sensorData[place][observation]["value"] = value;
	sensorData[place][observation]["timestamp"] = timestamp;
	
	// UPDATE data
	updateObservation(observation,place);
}

function addPlace(place_id, name, place) {
	var today = new Date();
	var tomorrow = new Date();
	var dat = new Date();
	
	tomorrow.setDate(tomorrow.getDate() + 1);
	dat.setDate(dat.getDate() + 2);

	$("#graph")
			.append(
					"<div class='tab-pane fade' id='"+ place_id + "' role='tabpanel' aria-labelledby='"+ place_id+ "-tab'>"
					+ "<div id='live_"+ place_id+ "'></div>"
					+ "<div class='container flex-row-reverse' id='forecast_"+ place_id+ "-tab'></div>"
					+ "</div>");

//	$("#forecast_" + place_id+"-tab").hide();
}

function addObservation(observation, place) {
	let obs_id = sensorData[place][observation]["div_id"];

	
	layout = "<div class='container'><div class='row align-items-center mb-3'>"
	+ "<div class='col'><p class='font-weight-bold'>" 
	+ sensorData[place][observation]["title"]
	+ "</p></div>"
	
	+ "<div class='col-auto'>" 
	+ "<button type='button' class='btn btn-success' id='value_+"+ obs_id+ "'>"
	+ "<span class='badge badge-light' id='value_"+ obs_id+ "'>---</span>&nbsp;"
	+ sensorData[place][observation]["symbol"]
	+ "<span class='badge badge-light ml-3' id='timestamp_"+ obs_id + "'>---</span>"
	+ "</button>"
	+ "</div>"
	
	+ "<div class='col-auto'>"
	+ "<form target='_blank' action='./history.html'>"
		+ "<input class='form-control form-control-sm' type='hidden' name='observation' value=\""+ observation+ "\" />"
		+ "<input class='form-control form-control-sm' type='hidden' name='placeUri' value=\"" + place + "\" />"
		+ "<input class='form-control form-control-sm' type='hidden' name='lat' value=\"" + escape(sensorData[place][observation]["lat"]) + "\" />"
		+ "<input class='form-control form-control-sm' type='hidden' name='long' value=\"" + escape(sensorData[place][observation]["long"]) + "\" />"
		+ "<input class='form-control form-control-sm' type='hidden' name='symbol' value='" + escape(sensorData[place][observation]["symbol"])+ "' />"
		+ "<input class='form-control form-control-sm' type='hidden' name='title' value='" + escape(sensorData[place][observation]["title"])+ "' />"
		+ "<input placeId='"+placeIds[place]+"' class='form-control form-control-sm' type='hidden' name='placeName' value='???' />"
		+ "<button class='btn btn-primary float-right' type='submit'><small><i class='fas fa-external-link-alt'></i>&nbsp;History</small></button>"
	+ "</form></div>"
	+ "</div></div>"
	
	$("#live_" + sensorData[place]["div_id"]).append(layout);	
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