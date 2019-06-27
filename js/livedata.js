displayWidth = 960; //960
displayHeight = 75; // 75
textWidth = 940; //940
textHeight = 13; // 27

mt = "15px";
mb = "20px";
mr = "10px";
fontSize = "15px";
dy ="1.5em";

let margin = {
		top : 15,
		right : 10,
		bottom : 30,
		left : 5
	}, 
	width = displayWidth - margin.left - margin.right, 
	height = displayHeight - margin.top - margin.bottom;

sensorData = {};

notifications = [ {
	"title" : "Notifications",
	"subtitle" : "(Added bindings)",
	"measures" : [ 0, 0 ],
	"ranges" : [ 0, 10 ],
	"markers" : [ 0 ],
	"place" : "",
	"quantity" : ""
} ];

let chart = d3.bullet().width(width).height(height);
let svg;

nots = 0;

function liveMonitor() {
	// PREFIXES
	prefixes = "";
	for (ns in jsap["namespaces"]) {
		prefixes += " PREFIX " + ns + ":<" + jsap["namespaces"][ns]
				+ ">";
	}
	const sepa = Sepajs.client;
	
	query = prefixes + " "
	+ jsap["queries"]["HISTORICAL_TRIPLES"]["sparql"];
	
	let historicalTriples = sepa.subscribe(query,jsap);
	historicalTriples.on("added",addedResults=>{
		for (binding of addedResults.results.bindings) {
    		if (binding.count != undefined) updateHistoryGraphSize(binding.count.value);
    }
	});
	
	query = prefixes + " "
	+ jsap["queries"]["LIVE_TRIPLES"]["sparql"];
	
	let liveTriples = sepa.subscribe(query,jsap);
	liveTriples.on("added",addedResults=>{
		for (binding of addedResults.results.bindings) {
    		if (binding.count != undefined) updateLiveGraphSize(binding.count.value);
    }
    });
	
	query = prefixes + " "
	+ jsap["queries"]["PLACES_COUNT"]["sparql"];
	
	let places = sepa.subscribe(query,jsap);
	places.on("added",addedResults=>{
		for (binding of addedResults.results.bindings) {
    		if (binding.count != undefined) updatePlacesCount(binding.count.value);
    }
    });
	
	query = prefixes + " "
	+ jsap["queries"]["OBSERVATIONS_COUNT"]["sparql"];
	
	let observation_count = sepa.subscribe(query,jsap);
	observation_count.on("added",addedResults=>{
		for (binding of addedResults.results.bindings) {
    		if (binding.count != undefined) updateObservationsCount(binding.count.value);
    }
    });
	
	query = prefixes + " "
	+ jsap["queries"]["OBSERVATIONS"]["sparql"];
	
	const observation = sepa.subscribe(query,jsap);
	observation.on("added",addedResults=>{      
		let date = new Date();
		let timestamp = date.toLocaleString();
		
        for (binding of addedResults.results.bindings) {

            // Check value validity
            if (binding.value.value == "NaN") continue;
            valueAsFloat = parseFloat(binding.value.value);
            
            let place = binding.location.value;
            let name = binding.name.value;
            let symbol = binding.symbol.value;
            let label = binding.label.value;
			let observation = binding.observation.value;
			let quantity = 	binding.quantity.value;

			console.log("Place: "+place+" Observation: "+observation);
            	
            // NEW PLACE
            if (sensorData[place] === undefined) {
            	    sensorData[place] = {};
            	    
            	    if (placeIds[place] === undefined) {
            	    		placeIds[place] = generateID();
            	    }
            	    sensorData[place]["div_id"] = placeIds[place];
            	    
            	    addPlace(sensorData[place]["div_id"],name);
            }
            
            // NEW OBSERVATION
            if (sensorData[place][observation] === undefined) {
            		if (symbol != null) title = label + " (" + symbol + ")";
            		else title = label + " (qudt-unit?)";
	        		
	        		sensorData[place][observation] = {};
	        		sensorData[place][observation]["div_id"] = generateID();
	        		sensorData[place][observation]["data"] = [];
	               		
	        		sensorData[place][observation]["data"].push({
            			"title" : title,
            			"subtitle" : observation,
            			"ranges" : [ valueAsFloat, valueAsFloat, valueAsFloat*2 ],
            			"measures" : [valueAsFloat, valueAsFloat ],
            			"markers" : [ valueAsFloat, valueAsFloat ],
            			"quantity" : quantity
            		});


	        		addObservation(observation,place,sensorData[place][observation]["data"]);
            }
            	   
            // UPDATE data
            updateObservation(observation,place,valueAsFloat);
        }
        
        updateNotifications();
    });
}

function showObservations(place) {
	if (sensorData[place] != undefined)
		$("#"+sensorData[place]["div_id"]).show();	
}

function addPlace(place_id, name) {
	$("#graph").append("<div class='collapse' id='"+place_id+"'><div class='card mt-3'><div class='card-header'>"+name+"</div></div></div>");
}

function addObservation(observation,place,data){
	let obs_id = sensorData[place][observation]["div_id"];
	
	$("#"+sensorData[place]["div_id"]).append("<div class='container'>" +
			"<div class='row flex-row-reverse'><div id='"+obs_id+"'></div></div>" +
			"<div class='row flex-row-reverse'>" +
				"<form target='_blank' action='./history.html'>" +
    					"<input class='form-control form-control-sm' type='hidden' name='observation' value=\""+observation+"\" />" +
    					"<input class='form-control form-control-sm' type='hidden' name='title' value='"+escape(sensorData[place][observation]["data"][0]["title"])+"' />" +
//    					"<input class='btn btn-primary' type='submit' value='History'/></form>" +
    					"<button class='btn btn-primary' type='submit'><small><i class='fas fa-external-link-alt'></i>&nbsp;History</small></button></form>" +
    			"<button type='button' class='btn btn-success mr-3' id='value_+"+obs_id+"'><span class='badge badge-light' id='value_"+obs_id+"'>---</span><span class='badge badge-light ml-3' id='timestamp_"+obs_id+"'>---</span></button>");
    
    let svg = d3.select("#"+obs_id).selectAll("svg").data(data).enter().append(
        "svg").attr("class", "bullet").style("margin-top",mt).attr("width",
        width + margin.left + margin.right).attr("height",
        height + margin.top + margin.bottom).append("g").attr("transform",
        "translate(" + margin.left + "," + margin.top + ")").call(chart);

    let title = svg.append("g").style("text-anchor", "end").attr("transform",
        "translate("+textWidth+","+textHeight+")");

    title.append("text").attr("class", "title").text(function(d) {
        return d.title;
    });

    title.append("text").attr("class", "subtitle").attr("dy", dy).text(
        function(d) {
            return d.subtitle;
        });
}

function updateObservation(observation,place,valueAsFloat) {
	let data = sensorData[place][observation]["data"][0];
	
	// Timestamp
	let obs_id = sensorData[place][observation]["div_id"];
	let date = new Date();
	let timestamp = date.toLocaleString();	
	$("#timestamp_"+obs_id).html(timestamp);
	$("#value_"+obs_id).html(valueAsFloat);
	
	data["measures"][0] = valueAsFloat;
	
	if (valueAsFloat < data["markers"][0]) {
		data["markers"][0] = valueAsFloat;
		data["ranges"][0] = valueAsFloat;
	}
	else if (valueAsFloat > data["markers"][1]) {
		data["markers"][1] = valueAsFloat;
		data["ranges"][1] = valueAsFloat;
		data["measures"][1] = valueAsFloat;
		if (valueAsFloat > data["ranges"][2])
			data["ranges"][2] = data["ranges"][2] * 2;
	}
	
	redrawSvg(sensorData[place][observation]["div_id"],sensorData[place][observation]["data"]);
}

function updateObservationsCount(count) {
	$("#odoObservations").html(count);	
}

function updatePlacesCount(count) {
	$("#odoPlaces").html(count);	
}

function updateHistoryGraphSize(count) {
	$("#odoHistorySize").html(count);	
}

function updateLiveGraphSize(count) {
	$("#odoLiveSize").html(count);	
}

function updateNotifications() {
	nots++;
	$("#odoNotifications").html(nots);
}

function randomize(d){
	return d;
}

 function redrawSvg(id,data) {
	 let svg = d3.select("#"+id).selectAll("svg").data(data);
	 svg.datum(randomize).call(chart.duration(1000));
 }