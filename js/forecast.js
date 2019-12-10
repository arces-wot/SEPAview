
function queryForecast(place,place_id,name) {
	let today = new Date("2019-07-30");
	
	addForecastForDay(place,place_id,name,today,0);
	addForecastForDay(place,place_id,name,today,1);
	addForecastForDay(place,place_id,name,today,2);
}

function addForecastForDay(place,place_id,name,day,n) {
	var fday = new Date(day);
	fday.setDate(fday.getDate()+n);
	
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
		//console.log("FORECAST_WEATHER_TEMPERATURE Place: "+place+ " From: "+from + " To: "+to);
		
		if (data.results.bindings.length != 0) {
			$("#forecast_"+place_id).show();
			
			binding = data.results.bindings[0];
			
			$("#forecast_"+place_id+"_"+forecast).append(
					"<div class='row flex-row-reverse align-items-center mt-3'>" +
					"<form target='_blank' action='./history.html'>" +
								"<input class='form-control form-control-sm' type='hidden' name='observedProperty' value=\""+"arces-monitor:AirTemperature"+"\" />" +
		    					"<input class='form-control form-control-sm' type='hidden' name='place' value=\""+place+"\" />" +
		    					"<input class='form-control form-control-sm' type='hidden' name='forecast' value=\""+forecast+"\" />" +
		    					"<input class='form-control form-control-sm' type='hidden' name='title' value='"+escape(name+" - Temperature forecast")+"' />" +
		    					"<button class='btn btn-primary ml-3' type='submit'><small><i class='fas fa-external-link-alt'></i>&nbsp;History</small></button></form>" +
		    			"<button type='button'class='btn btn-success ml-3'>" +
//		    			"Date<span class='badge badge-light ml-3 mr-3'>"+to.substr(0,10)+"</span>" +
		    			"Min<span class='badge badge-light ml-3 mr-3'>"+parseFloat(binding.min.value).toFixed(2)+"</span>" + 
		    			"Avg<span class='badge badge-light ml-3 mr-3'>"+parseFloat(binding.avg.value).toFixed(2)+"</span>" + 
		    			"Max<span class='badge badge-light ml-3'>"+parseFloat(binding.max.value).toFixed(2)+"</span>" +
		    			"</button>" +
		    			"<span class='font-weight-bold align-items-center'>Air Temperature (degC)</span></div>");
		    			
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
		//console.log("FORECAST_WEATHER_PRECIPITATION Place: "+place+ " From: "+from + " To: "+to);
		
		if (data.results.bindings.length != 0) {
			$("#forecast_"+place_id).show();
			
			binding = data.results.bindings[0];
			
			$("#forecast_"+place_id+"_"+forecast).append(
					"<div class='row flex-row-reverse align-items-center mt-3'>" +
						"<form action='./history.html'>" +
								"<input class='form-control form-control-sm' type='hidden' name='observedProperty' value=\""+"arces-monitor:Precipitation"+"\" />" +
		    					"<input class='form-control form-control-sm' type='hidden' name='place' value=\""+place+"\" />" +
		    					"<input class='form-control form-control-sm' type='hidden' name='forecast' value=\""+forecast+"\" />" +
		    					"<input class='form-control form-control-sm' type='hidden' name='title' value='"+name+" precipitation forecast' />" +
		    					"<button class='btn btn-primary ml-3' type='submit'><small><i class='fas fa-external-link-alt'></i>&nbsp;History</small></button></form>" +
		    			"<button type='button'class='btn btn-success ml-3'>" +
//		    			"Date<span class='badge badge-light ml-3 mr-3'>"+to.substr(0,10)+"</span>" +
		    			"<span class='badge badge-light'>"+parseFloat(binding.sum.value).toFixed(1)+"</span>" + 
		    			"</button>" +
		    			"<span class='font-weight-bold'>Precipitation (mm)</span></div>");
		    			
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
		//console.log("FORECAST_WEATHER_PRECIPITATION Place: "+place+ " From: "+from + " To: "+to);
		
		if (data.results.bindings.length != 0) {	
			$("#forecast_"+place_id).show();
			
			binding = data.results.bindings[0];
			
			$("#forecast_"+place_id+"_"+forecast).append(
					"<div class='row flex-row-reverse align-items-center mt-3'>" +
						"<form action='./history.html'>" +
								"<input class='form-control form-control-sm' type='hidden' name='observedProperty' value=\""+"arces-monitor:LeafAreaIndex"+"\" />" +
		    					"<input class='form-control form-control-sm' type='hidden' name='place' value=\""+place+"\" />" +
		    					"<input class='form-control form-control-sm' type='hidden' name='forecast' value=\""+forecast+"\" />" +
		    					"<input class='form-control form-control-sm' type='hidden' name='title' value='"+name+" precipitation forecast' />" +
		    					"<button class='btn btn-primary ml-3' type='submit'><small><i class='fas fa-external-link-alt'></i>&nbsp;History</small></button></form>" +
		    			"<button type='button'class='btn btn-warning ml-3'>" +
//		    			"Date<span class='badge badge-light ml-3 mr-3'>"+to.substr(0,10)+"</span>" +
		    			"<span class='badge badge-light'>"+parseFloat(binding.value.value).toFixed(2)+"</span>" + 
		    			"</button>" +
		    			"<span class='font-weight-bold'>LAI (#)</span></div>");
		    			
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
		//console.log("FORECAST_WEATHER_PRECIPITATION Place: "+place+ " From: "+from + " To: "+to);
		
		if (data.results.bindings.length != 0) {	
			$("#forecast_"+place_id).show();
			
			binding = data.results.bindings[0];
			
			$("#forecast_"+place_id+"_"+forecast).append(
					"<div class='row flex-row-reverse align-items-center mt-3'>" +
						"<form action='./history.html'>" +
								"<input class='form-control form-control-sm' type='hidden' name='observedProperty' value=\""+"arces-monitor:IrrigationNeeds"+"\" />" +
		    					"<input class='form-control form-control-sm' type='hidden' name='place' value=\""+place+"\" />" +
		    					"<input class='form-control form-control-sm' type='hidden' name='forecast' value=\""+forecast+"\" />" +
		    					"<input class='form-control form-control-sm' type='hidden' name='title' value='"+name+" precipitation forecast' />" +
		    					"<button class='btn btn-primary ml-3' type='submit'><small><i class='fas fa-external-link-alt'></i>&nbsp;History</small></button></form>" +
		    			"<button type='button'class='btn btn-info ml-3'>" +
//		    			"Date<span class='badge badge-light ml-3 mr-3'>"+to.substr(0,10)+"</span>" +
		    			"<span class='badge badge-light'>"+parseFloat(binding.value.value).toFixed(2)+"</span>" + 
		    			"</button>" +
		    			"<span class='font-weight-bold'>Irrigation needs (mm)</span></div>");
		    			
		}
	 });
}