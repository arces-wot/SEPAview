let serverUTCOffset = 0;
//let toDays = 2;
let fromDays = 7;

let a = [];
var max = [];
var min = [];

var s = new ColorScheme;

// Using a fixed palette 
var colors = ["#2980b9","#16a085","#17a595"]

var csvData;

var observation = [];
var title;
var calendar;
const selection = [];
var traces = [];
const axisLabels = ["y", "y2"]

var place = null;
var forecast = null;
var observedProperty;

var layout = {
	title : "No data",
	mode: 'lines+markers',
	xaxis : {
		domain : [ 0.15, 1.0 ],
		showgrid: true,
	    zeroline: false,
	    showline: false
	},
	titlefont : {
		family : 'Verdana',
		size : 22,
		color : 'rgb(16,125,246)'
	},
	yaxis : {
		range : [],
		color : colors[0],
		tickfont : {
			family : 'Verdana',
			size : 16,
			color : colors[0]
		},
		title: 'yaxis',
		showgrid: true,
	    zeroline: false,
	    showline: false
	},
//	yaxis2: {
//		title: 'yaxis2',
//		titlefont: { color: 'rgb(148, 103, 189)' },
//		tickfont: {
//			family: 'Verdana',
//			size: 16,
//			color: colors[1]
//		},
//		overlaying: 'y',
//		side: 'right',
//		showgrid: true,
//		zeroline: false,
//		showline: false
//	},
	margin:{
		l : 0
	}
};

function downloadCSV() {
	let csvContent = "data:text/csv;charset=utf-8,";

	csvData.forEach(function(rowArray) {
	    let row = rowArray.join(",");
	    csvContent += row + "\r\n";
	});
	
	var encodedUri = encodeURI(csvContent);
	window.open(encodedUri);
}

function onLoad() {
	Plotly.newPlot("plot", [], layout, { responsive: true });
	
	var parameters = window.location.search.substring(1).split("&");

	var now = new Date();
    var localTo = new Date(now.getTime());
    var localFrom = new Date(now.getTime() - fromDays * 24 * 3600 * 1000);
    
	var i;
	for (i=0; i < parameters.length; i++) {
		switch(parameters[i].split("=")[0]) {
		case "title":
			title = unescape(unescape(parameters[i].split("=")[1]));
			break;
		case "forecast":
			forecast = parameters[i].split("=")[1];
			break;
		case "place":
			place = decodeURIComponent(parameters[i].split("=")[1]);
			break;
		case "observedProperty":
			observedProperty = decodeURIComponent(parameters[i].split("=")[1]);
			break;
		}
	}
	
	layout.title = title;
	
	// TODO: use updateFormUI
	$("#form").append("<input type='hidden' name='forecast' value='"+forecast+"' />");
	$("#form").append("<input type='hidden' name='place' value=\""+place+"\" />");
	$("#form").append("<input type='hidden' name='observedProperty' value=\""+observedProperty+"\" />");
	
	calendarFrom = flatpickr("#from", {
		mode : "single",
		enableTime : true,
		defaultDate: [localFrom],
		time_24hr : true
	});
	
	calendarTo = flatpickr("#to", {
		mode : "single",
		enableTime : true,
		defaultDate: [localTo],
		time_24hr : true
	});
	
	onRefresh();
}

function doForecastQuery(place,property,from,to,n) {
	const sepa = Sepajs.client;
	const Bench = Sepajs.bench
	
	// PREFIXES
	prefixes = "";
	for (ns in jsap["namespaces"]) {
		prefixes += " PREFIX " + ns + ":<" + jsap["namespaces"][ns]
				+ ">";
	}
	
	bench = new Bench()
	query = bench.sparql(jsap["queries"]["FORECAST_N_DAYS"]["sparql"],{
		place :{
		   type: "uri",
	       value : place
		},
		property :{
			   type: "uri",
		       value : property
			},
		from : {
			type : "literal",
			value : from
		},
		to : {
			type : "literal",
			value : to
		},
		n : {
			type : "literal",
			value : n
		}
	})
	
	// BUG: to be fixed
	query = query.replace("?n",n);
	
	fullQuery = prefixes + " " + query;
	 
	return sepa.query(fullQuery,jsap).then((data)=>{ 
		 return results(data);
	 });	
}

function onRefresh() {

	traces = []

	serverTo = new Date(calendarTo.selectedDates[0].getTime());

	serverFrom = new Date(calendarFrom.selectedDates[0].getTime());

	doForecastQuery(place, observedProperty,serverFrom.toISOString().substring(0,10), serverTo.toISOString().substring(0,10),0)
		.then((data) => {			
			updateTraces(data,0)
			Plotly.newPlot("plot", traces, layout);
		});
	
	doForecastQuery(place, observedProperty,serverFrom.toISOString().substring(0,10), serverTo.toISOString().substring(0,10),1)
	.then((data) => {			
		updateTraces(data,1)
		Plotly.newPlot("plot", traces, layout);
	});
	
	doForecastQuery(place, observedProperty,serverFrom.toISOString().substring(0,10), serverTo.toISOString().substring(0,10),2)
	.then((data) => {			
		updateTraces(data,2)
		Plotly.newPlot("plot", traces, layout);
	});
}

function updateTraces(newTrace,forecast) {	
	if (forecast == 0) {
		newTrace.name = "Today";
	}
	else if (forecast == 1) {
		newTrace.name = "Tomorrow";
	}
	else newTrace.name = "Day after tomorrow";
	
	newTrace.line.color = colors[i];
	
	layout["yaxis"].title = newTrace.symbol;
	
	traces.push(newTrace)
}

function results(jsapObj) {
	
	var trace = {
		x : [],
		y : [],
		line : {
			width : 1.25,
		},
		type : 'scatter',
		symbol : "???"
	};
	
	
	csvData = [];

	for (binding of jsapObj.results.bindings) {
		timestamp = binding.timestamp.value;
		
		// Unit of measure
		if (binding.symbol != undefined) {
			trace.symbol = binding.symbol.value;
		}
		
		// To local time
		localTime = new Date(timestamp);
		
		value = parseFloat(binding.value.value);
			
		trace.x.push(localTime);
		trace.y.push(value);
			
		// CSV
		csvData.push([timestamp,value]);
	}

	return trace
}