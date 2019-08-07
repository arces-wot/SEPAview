function liveForecasts() {
	// PREFIXES
	prefixes = "";
	for (ns in jsap["namespaces"]) {
		prefixes += " PREFIX " + ns + ":<" + jsap["namespaces"][ns]
				+ ">";
	}
	const sepa = Sepajs.client;
	
	query = prefixes + " "
	+ jsap["queries"]["LAST_FORECASTS"]["sparql"];
	
	 var day = new Date();
	 var timestamp = day.toISOString().substr(0,10)+"T00:00:00Z";
	 query = query.replace("?day","'"+timestamp+"'");
	
	const observation = sepa.subscribe(query,jsap);
	observation.on("added",addedResults=>{      		
        for (binding of addedResults.results.bindings) {

            // Check value validity
            if (binding.value.value == "NaN") continue;
            valueAsFloat = parseFloat(binding.value.value);
            
            let place = binding.place.value;
            let name = binding.name.value;
            let symbol = binding.symbol.value;
            let label = binding.label.value;
			let observation = binding.property.value;
			let prediction  = binding.prediction.value;

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
            			"timestamp" : prediction,
            			"forecast" : true
            		});


	        		addObservation(observation,place,sensorData[place][observation]["data"]);
            }
            	   
            // UPDATE data
            updateObservation(observation,place,valueAsFloat);
        }
    });
}