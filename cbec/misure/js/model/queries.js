function queryHistory(observation,from,to) {
	const sepa = Sepajs.client;

	// PREFIXES
	prefixes = "";
	for (ns in jsap["namespaces"]) {
		prefixes += " PREFIX " + ns + ":<" + jsap["namespaces"][ns]
				+ ">";
	}
	
	query = prefixes + " "
	+ jsap["queries"]["LOG_QUANTITY"]["sparql"];

	// Forced bindings
	query = query.replace("?observation", "<"+observation+">");
	query = query.replace("?from", "'" + from + "'^^xsd:dateTime");
	query = query.replace("?to", "'" + to + "'^^xsd:dateTime");
	 
	return sepa.query(query,jsap).then((data)=>{ 
		 return data;
	 });
}

function queryPlaceTree(placeUri,placeName) {
    tree ={};
    tree["placeUri"] = placeUri;
	tree["placeName"] = placeName;
	tree["childs"] = [];
	
	return queryChilds(placeUri,tree["childs"]).then(()=>{
		return tree;
	})
}

function queryChilds(placeUri,tree) {
	const sepa = Sepajs.client;
    prefixes = "";
    for (ns in jsap["namespaces"]) {
        prefixes += " PREFIX " + ns + ":<"+ jsap["namespaces"][ns] + ">";
    }
    
    query = jsap["queries"]["CONTAINED_PLACES"]["sparql"];
	query = query.replace("?root","<"+placeUri+">");
	query = prefixes + " " + query;
	
    return sepa.query(query,jsap).then((data)=>{ 
		let places = data.results.bindings.length;
    	
		let promises = [];
		
		for (index = 0; index < places ; index++) {
			childUri = data.results.bindings[index].child.value;
			childName = data.results.bindings[index].name.value;
		    
			child ={};
			child["placeUri"] = childUri;
			child["placeName"] = childName;
			child["childs"] = [];
			
			tree.push(child);
			
			promises.push(queryChilds(childUri,child["childs"]));			
		}
		
		return Promise.all(promises).then(() => {
            return tree;
        })
		
	});
}

function queryForecast(place,place_id,name,day) {	
	initForecasts(place_id,day);
	
	addForecastForDay(place,place_id,name,day,0);
	addForecastForDay(place,place_id,name,day,1);
	addForecastForDay(place,place_id,name,day,2);
}

function addForecastForDay(place,place_id,name,day,n) {
	var fday = moment(day);
	fday.add(n,'days');
	
	temperatureForecast(place,place_id,day.toISOString(),fday.toISOString(),name,n);
	precipitationForecast(place,place_id,day.toISOString(),fday.toISOString(),name,n);
	LAIForecast(place,place_id,day.toISOString(),fday.toISOString(),name,n);
	irrigationForecast(place,place_id,day.toISOString(),fday.toISOString(),name,n);
}

function temperatureForecast(place,place_id,from,to,name,forecast) {
	const sepa = Sepajs.client;
	const Bench = Sepajs.bench
	
	// PREFIXES
	prefixes = "";
	for (ns in jsap["namespaces"]) {
		prefixes += " PREFIX " + ns + ":<" + jsap["namespaces"][ns]
				+ ">";
	}
	
	bench = new Bench()
	query = bench.sparql(jsap["queries"]["FORECAST_WEATHER_TEMPERATURE"]["sparql"],{
		place :{
		   type: "uri",
	       value : place
		},
		from : {
			type : "literal",
			value : from.substr(0,10)
		},
		to : {
			type : "literal",
			value : to.substr(0,10)
		}
	})
	
	fullQuery = prefixes + " " + query;
	
	sepa.query(fullQuery,jsap).then((data)=>{
		if (data.results.bindings.length != 0) {
			binding = data.results.bindings[0];
			
			showWeatherTemperatureForecast(place_id,place,name,forecast,binding)
		}
	 });		
}

function precipitationForecast(place,place_id,from,to,name,forecast) {
	const sepa = Sepajs.client;

	// PREFIXES
	prefixes = "";
	for (ns in jsap["namespaces"]) {
		prefixes += " PREFIX " + ns + ":<" + jsap["namespaces"][ns]
				+ ">";
	}
	
	const Bench = Sepajs.bench
	
	bench = new Bench()
	query = bench.sparql(jsap["queries"]["FORECAST_WEATHER_PRECIPITATION"]["sparql"],{
		place :{
		   type: "uri",
	       value : place
		},
		from : {
			type : "literal",
			value : from.substr(0,10)
		},
		to : {
			type : "literal",
			value : to.substr(0,10)
		}
	})
	
	fullQuery = prefixes + " " + query;
	
	sepa.query(fullQuery,jsap).then((data)=>{
		if (data.results.bindings.length != 0) {		
			binding = data.results.bindings[0];
			
			showWeatherPrecipitationForecast(place_id,place,name,forecast,binding);    			
		}
	 });		
}

function LAIForecast(place,place_id,from,to,name,forecast) {
	const sepa = Sepajs.client;

	// PREFIXES
	prefixes = "";
	for (ns in jsap["namespaces"]) {
		prefixes += " PREFIX " + ns + ":<" + jsap["namespaces"][ns]
				+ ">";
	}
	
	const Bench = Sepajs.bench
	
	bench = new Bench()
	query = bench.sparql(jsap["queries"]["FORECAST_LAI"]["sparql"],{
		place :{
		   type: "uri",
	       value : place
		},
		from : {
			type : "literal",
			value : from.substr(0,10)
		},
		to : {
			type : "literal",
			value : to.substr(0,10)
		}
	})
	
	fullQuery = prefixes + " " + query;
	
	sepa.query(fullQuery,jsap).then((data)=>{		
		if (data.results.bindings.length != 0) {	
			binding = data.results.bindings[0];
			
			showLAIForecast(place_id,place,name,forecast,binding);
		}
	 });	
}

function irrigationForecast(place,place_id,from,to,name,forecast) {
	const sepa = Sepajs.client;

	// PREFIXES
	prefixes = "";
	for (ns in jsap["namespaces"]) {
		prefixes += " PREFIX " + ns + ":<" + jsap["namespaces"][ns]
				+ ">";
	}
	
	const Bench = Sepajs.bench
	
	bench = new Bench()
	query = bench.sparql(jsap["queries"]["FORECAST_IRRIGATION"]["sparql"],{
		place :{
		   type: "uri",
	       value : place
		},
		from : {
			type : "literal",
			value : from.substr(0,10)
		},
		to : {
			type : "literal",
			value : to.substr(0,10)
		}
	})
	
	fullQuery = prefixes + " " + query;
	
	sepa.query(fullQuery,jsap).then((data)=>{
		if (data.results.bindings.length != 0) {	
			binding = data.results.bindings[0];
			
			showIrrigationForecast(place_id,place,name,forecast,binding);			
		}
	 });
}