function subscribe() {
	// PREFIXES
	prefixes = "";
	for (ns in jsap["namespaces"]) {
		prefixes += " PREFIX " + ns + ":<" + jsap["namespaces"][ns]
				+ ">";
	}
//	const sepa = Sepajs.client;
	
//	query = prefixes + " "
//	+ jsap["queries"]["HISTORICAL_TRIPLES"]["sparql"];
//	
//	let historicalTriples = sepa.subscribe(query,jsap);
//	historicalTriples.on("added",addedResults=>{
//		for (binding of addedResults.results.bindings) {
//    		if (binding.count != undefined) updateHistoryGraphSize(binding.count.value);
//    }
//	});
	
//	query = prefixes + " "
//	+ jsap["queries"]["FORECASTS_COUNT"]["sparql"];
//	
//	let forecastsCount = sepa.subscribe(query,jsap);
//	forecastsCount.on("added",addedResults=>{
//		for (binding of addedResults.results.bindings) {
//    		if (binding.count != undefined) updateForecastsCount(binding.count.value);
//    }
//	});
	
//	query = prefixes + " "
//	+ jsap["queries"]["LIVE_TRIPLES"]["sparql"];
//	
//	let liveTriples = sepa.subscribe(query,jsap);
//	liveTriples.on("added",addedResults=>{
//		for (binding of addedResults.results.bindings) {
//    		if (binding.count != undefined) updateLiveGraphSize(binding.count.value);
//    }
//    });
	
	query = prefixes + " "
	+ jsap["queries"]["FOI_COUNT"]["sparql"];
	
	let foi = sepa.subscribe(query,jsap);
	foi.on("added",addedResults=>{
		for (binding of addedResults.results.bindings) {
    		if (binding.count != undefined) updateFoiCount(binding.count.value);
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
	
	let observation = sepa.subscribe(query,jsap);
	observation.on("added",addedResults=>{
		updateNotifications();      		
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