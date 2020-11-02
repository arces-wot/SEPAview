
sensorData = {};

notifications = [{
	"title": "Notifications",
	"subtitle": "(Added bindings)",
	"place": "",
	"quantity": ""
}];

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

		sensorData[foi][prop]["urn"] = binding.urn.value;

		sensorData[foi][prop]["placeUri"] = foi;
		sensorData[foi][prop]["placeName"] = name;
		sensorData[foi][prop]["lat"] = lat;
		sensorData[foi][prop]["long"] = long;
		sensorData[foi][prop]["zoneName"] = tzlookup(parseFloat(lat), parseFloat(long));

		sensorData[foi][prop]["title"] = label;
		sensorData[foi][prop]["symbol"] = (symbol != null ? symbol : "qudt-unit?");
		sensorData[foi][prop]["value"] = value;
		sensorData[foi][prop]["timestamp"] = timestamp;

		addObservation(prop, foi);
	}

	sensorData[foi][prop]["value"] = value;
	sensorData[foi][prop]["timestamp"] = timestamp;

	// UPDATE data
	updateObservation(prop, foi);
}

function buildLegend() {
	var freeze = document.createElement("span");
	freeze.setAttribute("class", "badge badge-secondary ml-3 mr-3");
	freeze.setAttribute("id","badge-freezing");
	freeze.innerHTML = "Freeze "+thresholds.abc.freeze+"/"+thresholds.d.freeze;
	
	var fanon = document.createElement("span");
	fanon.setAttribute("class", "badge badge-primary mr-3");
	fanon.setAttribute("id","badge-fan-on");
	fanon.innerHTML = "Fan on "+thresholds.abc.fan_on+"/"+thresholds.d.fan_on;
	
	var warning = document.createElement("span");
	warning.setAttribute("class", "badge badge-warning mr-3");
	warning.setAttribute("id","badge-warning");
	warning.innerHTML = "Warning "+thresholds.abc.pre_alarm+"/"+thresholds.d.pre_alarm;
	
	var danger = document.createElement("span");
	danger.setAttribute("class", "badge badge-danger mr-3");
	danger.setAttribute("id","badge-danger");
	danger.innerHTML = "Danger "+thresholds.abc.alarm+"/"+thresholds.d.alarm;
		
	var legend = document.createElement("button");
	legend.setAttribute("class", "btn btn-sm btn-light");
	legend.innerHTML = "Temperature thresholds (probes ABC/probe D)";	
	
	legend.appendChild(freeze);
	legend.appendChild(fanon);
	legend.appendChild(warning);
	legend.appendChild(danger);
	
	return legend;
}
	
function addPlace(place_id) {
	var legend_div = document.createElement("div");
	legend_div.setAttribute("class", "row d-flex justify-content-end");
	legend_div.appendChild(buildLegend());
	
	var container = document.createElement("div");
	container.setAttribute("class", "container flex");
	container.setAttribute("id", "live_" + place_id);

	var tab_pane = document.createElement("div");
	tab_pane.setAttribute("class", "tab-pane fade");
	tab_pane.setAttribute("id", place_id);
	tab_pane.setAttribute("role", "tabpanel");
	tab_pane.setAttribute("aria-labelledby", place_id + "-tab");
	tab_pane.appendChild(container);
	tab_pane.appendChild(legend_div);

	document.getElementById("graph").appendChild(tab_pane);
}

function addObservation(prop, foi) {
	let obs_id = sensorData[foi][prop]["div_id"];

	var title = document.createElement("p");
	title.setAttribute("class", "font-weight-bold");
	title.innerHTML = sensorData[foi][prop]["title"] + " (" + sensorData[foi][prop]["urn"] + ")";

	var value = document.createElement("span");
	value.setAttribute("class", "badge badge-light");
	value.setAttribute("id", "value_" + obs_id);

	var unit = document.createElement("span");
	unit.innerHTML = "&nbsp;" + sensorData[foi][prop]["symbol"];

	var ts = document.createElement("span");
	ts.setAttribute("id", "timestamp_" + obs_id);

	var button = document.createElement("button");
	button.setAttribute("type", "button");
	button.setAttribute("class", "btn btn-success");
	button.setAttribute("id", obs_id);
	button.appendChild(value);

	var col_title = document.createElement("div");
	col_title.setAttribute("class", "col-4");
	col_title.appendChild(title);

	var col_button = document.createElement("div");
	col_button.setAttribute("class", "col-2");
	col_button.appendChild(button);

	var col_unit = document.createElement("div");
	col_unit.setAttribute("class", "col-2");
	col_unit.appendChild(unit);

	var col_ts = document.createElement("div");
	col_ts.setAttribute("class", "col-4");
	col_ts.appendChild(ts);

	var obs = document.createElement("div");
	obs.setAttribute("class", "row align-items-center mb-3");
	obs.appendChild(col_title);
	obs.appendChild(col_button);
	obs.appendChild(col_unit);
	obs.appendChild(col_ts);

	document.getElementById("live_" + sensorData[foi]["div_id"]).appendChild(obs);

	sortObservations("live_" + sensorData[foi]["div_id"]);
}

function sortObservations(id) {
	var toSort = document.getElementById(id).children;
	toSort = Array.prototype.slice.call(toSort, 0);
	toSort.sort(function(a, b) {
		return a.childNodes[0].childNodes[0].innerHTML.localeCompare(b.childNodes[0].childNodes[0].innerHTML);
	});

	var parent = document.getElementById(id);
	parent.innerHTML = "";

	for (var i = 0, l = toSort.length; i < l; i++) {
		parent.appendChild(toSort[i]);
	}
}

function orderObservationsByLabel(id) {
	var toSort = document.getElementById(id).children;
	toSort = Array.prototype.slice.call(toSort, 0);
	toSort.sort(function(a, b) {
		return a.html.localeCompare(b.html)
	});

	var parent = document.getElementById(id);
	parent.innerHTML = "";

	for (var i = 0, l = toSort.length; i < l; i++) {
		parent.appendChild(toSort[i]);
	}
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

function updateObservation(prop, foi) {
	let obs_id = sensorData[foi][prop]["div_id"];

	value = sensorData[foi][prop]["value"];
	timestamp = sensorData[foi][prop]["timestamp"];

	tz = document.getElementById("selectTimeZone").value;

	if (tz == "UTC") {
		time = moment(timestamp).utc()
	}
	else if (tz == "Local") {
		time = moment(timestamp)
	}
	else {
		zone = sensorData[foi][prop]["zoneName"];
		if (zone == "America/Sao_Paulo") {
			zone = "America/Belem"
		}
		time = moment(timestamp).utc().tz(zone);
	}

	$("#timestamp_" + obs_id).html(time.format("LLL"));
	$("#value_" + obs_id).html(value);
	updateButtonColor(obs_id, prop, value);
}