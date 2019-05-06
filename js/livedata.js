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

let margin = {
	top : 0,
	right : 10,
	bottom : 30,
	left : 5
}, width = 960 - margin.left - margin.right, height = 75 - margin.top
		- margin.bottom;

let chart = d3.bullet().width(width).height(height);
let svg;

nots = 0;

function liveMonitor() {
	//createNotificationsSvg();
	
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
	+ jsap["queries"]["OBSERVATIONS"]["sparql"];
	
	let a = sepa.subscribe(query,jsap);
	a.on("added",addedResults=>{
		added = addedResults.results.bindings.length;
        
        for (binding of addedResults.results.bindings) {

            // Check value validity
            if (binding.value.value == "NaN") continue;
            valueAsFloat = parseFloat(binding.value.value);
            
            let place = binding.location.value;
            let unit = binding.unit.value;
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
            	    
            	    addPlace(sensorData[place]["div_id"],label);
            }
            
            // NEW OBSERVATION
            if (sensorData[place][observation] === undefined) {
	            	// TODO: to be replaced with rdfs:label from qu-unit
	        		if (unit.endsWith("Percent")) title = label + " (%)";
	        		else if (unit.endsWith("DegreeCelsius")) title = label + " (°C)";
	        		else if (unit.endsWith("Millibar")) title = label + " (mBar)";
	        		else if (unit.endsWith("Volt")) title = label + " (V)";
	        		
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
        
        //$('#loader_wrap').addClass("hide-loader");
    });
}

function addPlace(place_id, name) {
	cls_btn_id = place_id + "_closeButton";
    div_btn_e_titolo_id = place_id + "_closeButtonETitolo";

    $("#graph").append("<div class='graph' id='"+place_id+"'></div>");
    $("#"+place_id).append("<div id='"+ div_btn_e_titolo_id +"' style='margin-left: -60%'></div>");
    $("#"+div_btn_e_titolo_id).append("<a href=\"javascript:void(0)\" id=\"" + div_btn_e_titolo_id +"\"" +
		"class=\"closebtn\" onClick=\"closeDiv($(this).parent().parent().attr('id'))\"" +
		"style='margin-right: 10px; text-decoration: none; color: #000; font-size: 30px'>&times;</a>");
    $("#"+div_btn_e_titolo_id).append("<h2 style='display:inline-block'>"+name+"</h2>");
	// Hide place
	//$("#"+place_id).hide();


}

function addObservation(observation,place,data){
	//TODO: add timestamp of last data.

	let obs_id = sensorData[place][observation]["div_id"];

	$("#"+sensorData[place]["div_id"]).append("<div id='"+obs_id+"' style='margin-bottom: 20px;  display:flex; align-items: center;" +
		" flex-flow: row; justify-content: center'></div>");
	
    let svg = d3.select("#"+obs_id).selectAll("svg").data(data).enter().append(
        "svg").attr("class", "bullet").style("margin-top","30px").attr("width",
        width + margin.left + margin.right).attr("height",
        height + margin.top + margin.bottom).append("g").attr("transform",
        "translate(" + margin.left + "," + margin.top + ")").call(chart);

    let title = svg.append("g").style("text-anchor", "end").attr("transform",
        "translate(940,27)");

    title.append("text").attr("class", "title").text(function(d) {
        return d.title;
    });

    title.append("text").attr("class", "subtitle").attr("dy", "1em").text(
        function(d) {
            return d.subtitle;
        });
    
    $("#"+obs_id).append("<div id='button_"+obs_id+"' class='div_button' ></div>");

    // USE FORM with hidden parameters
    $("#button_"+obs_id).append("<form target=\"_blank\" action=\"./indexAnalitics.html\">" +
    		"<input type=\"hidden\" name=\"observation\" value=\""+observation+"\" />" +
    		"<input type=\"hidden\" name=\"title\" value=\""+escape(sensorData[place][observation]["data"][0]["title"])+"\" />" +
    		"<input id='history_btn' type=\"submit\" value=\"History\"></form>");
}

function updateObservation(observation,place,valueAsFloat) {
	let data = sensorData[place][observation]["data"][0];
	
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