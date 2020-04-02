function subscribe() {
	const sepa = Sepajs.client;
	const bench = new Sepajs.bench();
	
	// PREFIXES
	prefixes = "";
	for (ns in jsap["namespaces"]) {
		prefixes += " PREFIX " + ns + ":<" + jsap["namespaces"][ns]
				+ ">";
	}
	
	query = bench.sparql(jsap["queries"]["OBSERVATIONS"]["sparql"], {	
		"qudtGraph": {
			"type": "uri",
			"value": "http://localhost:8890/DAV"
		},
		"obsGraph": {
			"type": "uri",
			"value": "http://covid19/observation"
		},
		"proGraph": {
			"type": "uri",
			"value": "http://covid19/observation/context"
		},
		"ctxGraph": {
			"type": "uri",
			"value": "http://covid19/context"
		}
	})
	
	query = prefixes + " " + query;
	
	let observation = sepa.subscribe(query, jsap);
	observation.on("added",addedResults=>{      		
        for (binding of addedResults.results.bindings) {
        	onObservation(binding);
        }
	});
	
	
	query = bench.sparql(jsap["queries"]["OBSERVATIONS"]["sparql"], {	
		"qudtGraph": {
			"type": "uri",
			"value": "http://localhost:8890/DAV"
		},
		"obsGraph": {
			"type": "uri",
			"value": "http://istat/demographics"
		},
		"proGraph": {
			"type": "uri",
			"value": "http://istat/demographics/context"
		},
		"ctxGraph": {
			"type": "uri",
			"value": "http://covid19/context"
		}
	})
	
	query = prefixes + " " + query;
	
	let observation1 = sepa.subscribe(query, jsap);
	observation1.on("added",addedResults=>{      		
        for (binding of addedResults.results.bindings) {
        	onObservation(binding);
        }
	});
	
	query = prefixes + " "
	+ jsap["queries"]["MAP_PLACES"]["sparql"];
	
	let mapPlaces = sepa.subscribe(query,jsap);
	mapPlaces.on("added",addedResults=>{
		onAddedMapPlace(addedResults.results.bindings);
	});
	mapPlaces.on("removed",removedResults=>{
		onRemovedMapPlace(removedResults.results.bindings);
	});
}