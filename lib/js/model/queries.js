//function queryFields() { 
//	return sepa.query(prefixes + " "
//			+ jsap["queries"]["FIELD"]["sparql"],jsap).then((data)=>{  				
//				return data;
//	 });	
//}
//
//function queryIrrigationRequestsCount() {
//	return sepa.query(prefixes + " "
//			+ jsap["queries"]["IRRIGATION_REQUESTS_COUNT"]["sparql"],jsap).then((data)=>{  
//				return data.results.bindings[0].n.value;
//	 });	
//}
//
//function queryCrops() { 
//	return sepa.query(prefixes + " "
//			+ jsap["queries"]["CROP"]["sparql"],jsap).then((data)=>{  
//				let n = data.results.bindings.length;
//				
//				ret = {};
//				
//				for (index = 0; index < n ; index++) {
//					crop = data.results.bindings[index].crop.value;
//					label = data.results.bindings[index].label.value;
//					ret[label] = crop;
//				}
//				
//				return ret;
//	 });	
//}
//
//function queryIrrigationRequests(field) {
//	query = bench.sparql(jsap["queries"]["IRRIGATION_REQUESTS_BY_FIELD"]["sparql"],{
//		fieldUri :{
//		   type: "uri",
//	       value : field
//		}		
//	})
//	
//	return sepa.query(prefixes + " " + query,jsap).then((data)=>{ 
//		let n = data.results.bindings.length;
//		
//		ret = [];
//		
//		for (index = 0; index < n ; index++) {					
//			irr = {};
//			irr["scheduled"] = data.results.bindings[index].scheduled.value.split("T")[0];
//			irr["issuedBy"] = data.results.bindings[index].issuedBy.value;
//			//irr["status"] = data.results.bindings[index].currentStatus.value;
//			//irr["request"] = data.results.bindings[index].requestNumber.value;
//			irr["reservation"] = data.results.bindings[index].reservationNumber.value;
//			
//			irr["done"] = "---"
//			if (data.results.bindings[index].done != null) irr["done"] = data.results.bindings[index].done.value.split("T")[0];
//						
//			ret.push(irr);
//		}
//		
//		return ret;
//	 });
//}

function queryHistory(foi,property,from,to) {
	// Forced bindings
// let query = query.replace("?observation", "<"+observation+">");
// let query = query.replace("?from", "'" + from + "'^^xsd:dateTime");
// let query = query.replace("?to", "'" + to + "'^^xsd:dateTime");
//	 
	query = bench.sparql(jsap["queries"]["LOG_QUANTITY"]["sparql"],{
		foi :{
		   type: "uri",
	       value : foi
		},
		from : {
			type:"literal",
			value: from
		},
		to : {
			type : "literal",
			value : to
		},
		property :{
		   type: "uri",
	       value : property
		},
		
	})
	
	return sepa.query(prefixes + " " + query,jsap).then((data)=>{ 
		 return data;
	 });
}

function queryPlaceTree(placeUri,placeName) {
    tree ={};
    tree["placeUri"] = placeUri;
	tree["placeName"] = placeName;
	tree["childs"] = [];
	
//	return queryChilds(placeUri,tree["childs"]).then(()=>{
//		return tree;
//	})

	console.log("queryPlaceTree "+placeUri+" "+placeName)

	return queryFoi(placeUri,tree["childs"]).then(()=>{
		return tree;
	});
}

function queryFoi(placeUri,tree) {
	console.log("queryFoi "+placeUri)
	
	query = bench.sparql(jsap["queries"]["CONTAINED_FOI"]["sparql"],{
		root :{
		   type: "uri",
	       value : placeUri
		}
	})
	
	return sepa.query(prefixes + " " + query,jsap).then((data)=>{
		let fois = data.results.bindings.length;
		
		for (index = 0; index < fois ; index++) {
			childUri = data.results.bindings[index].foi.value;
			childName = data.results.bindings[index].name.value;
		    
			child ={};
			child["placeUri"] = childUri;
			child["placeName"] = childName;
			child["childs"] = [];
			
			console.log("Push child "+child)
			
			tree.push(child);		
		}
		
		return queryChilds(placeUri,tree);	
	});
}

function queryChilds(placeUri,tree) {
	console.log("queryChilds "+placeUri)
	
    query = bench.sparql(jsap["queries"]["CONTAINED_PLACES"]["sparql"],{
		root :{
		   type: "uri",
	       value : placeUri
		}
	})
    
    return sepa.query(prefixes + " " + query,jsap).then((data)=>{ 
		let places = data.results.bindings.length;
    	
		let promises = [];
		
		for (index = 0; index < places ; index++) {
			childUri = data.results.bindings[index].child.value;
			childName = data.results.bindings[index].name.value;
		    
			child ={};
			child["placeUri"] = childUri;
			child["placeName"] = childName;
			child["childs"] = [];
			
			console.log("Push child "+child)
			
			tree.push(child);
			
			promises.push(queryFoi(childUri,child["childs"]));			
		}
		
		return Promise.all(promises).then(() => {
            return tree;
        })
		
	});
}

//function queryForecast(place,place_id,name,day) {	
//	initForecasts(place_id,day);
//	
//	addForecastForDay(place,place_id,name,day,0);
//	addForecastForDay(place,place_id,name,day,1);
//	addForecastForDay(place,place_id,name,day,2);
//}
//
//function addForecastForDay(place,place_id,name,day,n) {
//	var fday = moment(day);
//	fday.add(n,'days');
//	
//	temperatureForecast(place,place_id,day.toISOString(),fday.toISOString(),name,n);
//	precipitationForecast(place,place_id,day.toISOString(),fday.toISOString(),name,n);
//	LAIForecast(place,place_id,day.toISOString(),fday.toISOString(),name,n);
//	irrigationForecast(place,place_id,day.toISOString(),fday.toISOString(),name,n);
//}
//
//function temperatureForecast(place,place_id,from,to,name,forecast) {
//	query = bench.sparql(jsap["queries"]["FORECAST_WEATHER_TEMPERATURE"]["sparql"],{
//		place :{
//		   type: "uri",
//	       value : place
//		},
//		from : {
//			type : "literal",
//			value : from.substr(0,10)
//		},
//		to : {
//			type : "literal",
//			value : to.substr(0,10)
//		}
//	})
//	
//	sepa.query(prefixes + " " + query,jsap).then((data)=>{
//		if (data.results.bindings.length != 0) {
//			binding = data.results.bindings[0];
//			
//			showWeatherTemperatureForecast(place_id,place,name,forecast,binding)
//		}
//	 }).catch((debug)=>{
//		 console.log(debug);
//	 });		
//}
//
//function precipitationForecast(place,place_id,from,to,name,forecast) {
//	query = bench.sparql(jsap["queries"]["FORECAST_WEATHER_PRECIPITATION"]["sparql"],{
//		place :{
//		   type: "uri",
//	       value : place
//		},
//		from : {
//			type : "literal",
//			value : from.substr(0,10)
//		},
//		to : {
//			type : "literal",
//			value : to.substr(0,10)
//		}
//	})
//	
//	sepa.query(prefixes + " " + query,jsap).then((data)=>{
//		if (data.results.bindings.length != 0) {		
//			binding = data.results.bindings[0];
//			
//			showWeatherPrecipitationForecast(place_id,place,name,forecast,binding);    			
//		}
//	 });		
//}
//
//function LAIForecast(place,place_id,from,to,name,forecast) {
//	query = bench.sparql(jsap["queries"]["FORECAST_LAI"]["sparql"],{
//		place :{
//		   type: "uri",
//	       value : place
//		},
//		from : {
//			type : "literal",
//			value : from.substr(0,10)
//		},
//		to : {
//			type : "literal",
//			value : to.substr(0,10)
//		}
//	})
//	
//	sepa.query(prefixes + " " + query,jsap).then((data)=>{		
//		if (data.results.bindings.length != 0) {	
//			binding = data.results.bindings[0];
//			
//			showLAIForecast(place_id,place,name,forecast,binding);
//		}
//	 });	
//}
//
//function irrigationForecast(place,place_id,from,to,name,forecast) {
//	query = bench.sparql(jsap["queries"]["FORECAST_IRRIGATION"]["sparql"],{
//		place :{
//		   type: "uri",
//	       value : place
//		},
//		from : {
//			type : "literal",
//			value : from.substr(0,10)
//		},
//		to : {
//			type : "literal",
//			value : to.substr(0,10)
//		}
//	})
//	
//	sepa.query(prefixes + " " + query,jsap).then((data)=>{
//		if (data.results.bindings.length != 0) {	
//			binding = data.results.bindings[0];
//			
//			showIrrigationForecast(place_id,place,name,forecast,binding);			
//		}
//	 });
//}