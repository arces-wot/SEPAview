let serverUTCOffset = 0;
let lastHours = 24;

let a = [];
var max = [];
var min = [];

var s = new ColorScheme;

// To be used for a color palette
// var colors = s.from_hue(10).scheme('analogic').variation("pastel")
// .distance(0.5).colors();
var colors = ['rgb(16,125,246)'];

var csvData;

var observation;
var title;
var calendar;

var layout = {
	title : "Title",
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
		showgrid: true,
	    zeroline: false,
	    showline: false
	},
	width : 0.9 * window.innerWidth,
	height : 0.7 * window.innerHeight
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
	var parameters = window.location.search.substring(1).split("&");

    var localTo = new Date();
    var localFrom = new Date(localTo.getTime() - lastHours * 3600 * 1000);
    
	var i;
	for (i=0; i < parameters.length; i++) {
		switch(parameters[i].split("=")[0]) {
		case "observation":
			observation = decodeURIComponent(parameters[i].split("=")[1]);
			break;
		case "title":
			title = unescape(unescape(parameters[i].split("=")[1]));
			break;
		}
	}
	
	layout.title = title;
	
	 $("#form").append("<input type='hidden' name='observation' value=\""+observation+"\" />");
	 $("#form").append("<input type='hidden' name='title' value='"+escape(title)+"'/>");
	
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
	
    doQuery(observation,localFrom.toISOString(),localTo.toISOString());
}

function doQuery(observation,from,to) {
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

	console.log("Observation: "+observation);
	console.log("From: "+from);
	console.log("To: "+to);
	 
	sepa.query(query,jsap).then((data)=>{ 
		 results(data);
	 });	
}

function onRefresh() {
	// Convert to SERVER local time
	serverTo = new Date(calendarTo.selectedDates[0].getTime());
	sparqlTo = serverTo.toISOString();
	
	serverFrom = new Date(calendarFrom.selectedDates[0].getTime());
	sparqlFrom = serverFrom.toISOString();
	
    doQuery(observation,sparqlFrom,sparqlTo);	
}

// LOADING...
// var timer = window.setInterval(waitingTimer, 1000);
// var seconds = 0;
//
// function waitingTimer() {
// seconds += 1;
// document.getElementById('waiting').innerHTML = "<h3 id='load'>Loading
// data...please wait...(elapsed seconds: "
// + seconds + ")</h3>";
// }

function results(jsapObj) {
	var traces = [];
	var layouts = [];

	// LOADING...
	// window.clearInterval(timer);

	// This was supposed to be used to visualize multiple graphs. Now we have
	// just one graph to show.
	// for (i in a) {
	var trace = {
		x : [],
		y : [],
		name : "value",
		line : {
			width : 1,
			color : colors[0]
		},
		type : 'scatter'
	};
	traces.push(trace);

	layouts.push({
		title : layout.title,
		titlefont : {
			family : 'Verdana',
			size : 10,
			color : 'rgb(17,57,177)'
		},
		color : colors[0],
		tickfont : {
			family : 'Verdana',
			size : 10
		}
	});
	// }
	
	csvData = [];

	for (binding of jsapObj.results.bindings) {
		timestamp = binding.timestamp.value;

		// To local time
		localTime = new Date(timestamp);
		
		for (i in traces) {
			if (binding[traces[i].name] === undefined)
				continue;
			
			value = parseFloat(binding[traces[i].name].value);
			
			traces[i].x.push(localTime);
			traces[i].y.push(value);
			
			// CSV
			csvData.push([timestamp,value]);

			console.log("Value: "+value+" Max: "+max[i]+" Min: "+min[i])
			
			if (max[i] === undefined) {
				max[i] = value;
				min[i] = value;
			} else {
				if (value > max[i]) {
					max[i] = value;
				}
				else if (value < min[i]) {
					min[i] = value;
				}
			}

			if (i !== "0") {
				index = parseInt(i, 10) + 1;
				traces[i].yaxis = "y" + index;

				if (i === 1) {
					layout.yaxis2.range[0] = min[i];
					layout.yaxis2.range[1] = max[i];
				}
			} else {
				layout.yaxis.range[0] = min[i];
				layout.yaxis.range[1] = max[i];
			}
		}
	}
	
	layout.yaxis.range[1] = layout.yaxis.range[1] + (layout.yaxis.range[1]-layout.yaxis.range[0])*0.25;
	layout.yaxis.range[0] = layout.yaxis.range[0] - (layout.yaxis.range[1]-layout.yaxis.range[0])*0.25;
	
	// Overview (all traces)
	var data = [];
	for (i in traces) {
		data.push(traces[i]);
	}

	Plotly.newPlot("plot", data, layout);

	// Trace by trace
	for (i in traces - 1) {
		var data = [ traces[i] ];
		Plotly.newPlot(traces[i].name, data, layouts[i]);
	}

	window.onresize = function() {
		Plotly.relayout("plot", {
			width : 0.9 * window.innerWidth,
			height : 0.7 * window.innerHeight
		})
	}
}
