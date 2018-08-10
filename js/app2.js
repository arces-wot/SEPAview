let a = window.opener.x;
console.log(window.opener.x);
var variables = [ "temperature1", "temperature2"];
var titles = ["Temperature Server ERCOLE Core 1 of 20 (ARCES-Risorgimento)", "Temperature Server GIOVE Core 1 of 6 (ARCES-Toffano) "];
//var a = ["arces-monitor:QuantityValue-E120AF28-7B98-11E8-9BD5-A77C67284400","arces-monitor:QuantityValue-E1187C2C-7B98-11E8-9BD5-A77C67284400"];

var max =[];
var min = [];

//for( var i = 0 ; i <= a.length - 1 ; i++ ){

	let queries = "{?log arces-monitor:refersTo arces-monitor:" + a + "; qudt-1-1:numericValue ?temperature1; time:inXSDDateTimeStamp ?timestamp}";

//}




var host ="mml.arces.unibo.it";
	
var s = new ColorScheme;
var colors = s.from_hue(10).scheme('analogic').variation("pastel").distance(0.5).colors();

var layout = {
	title : 'Overview',
	xaxis : {
		domain : [ 0.15, 1.0 ]
	},
	titlefont : {
		family : 'Verdana',
		size : 24,
		color : 'rgb(17,57,177)'
	},
	yaxis : {
		range: [],
		title : titles[0],
		color : colors[0],
		tickfont : {
			family : 'Verdana',
			size : 10,
			color : colors[0]
		}
	},
	yaxis2 : {
		range: [],
		title : titles[1],
		color : colors[1],
		overlaying : 'y',
		anchor : "free",
		position : 0.0,
		side: 'left',
		tickfont : {
			family : 'Verdana',
			size : 10,
			color : colors[1]
		}
	}
}

function queryLiveData(callback) {
	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(xmlHttp.responseText);
	}

	prefix = "prefix arces-monitor:<http://wot.arces.unibo.it/monitor#>";
	prefix += " prefix rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>";
	prefix += " prefix owl:<http://www.w3.org/2002/07/owl#>";
	prefix += " prefix qudt-1-1:<http://qudt.org/1.1/schema/qudt#>";
	prefix += " prefix qudt-unit-1-1:<http://qudt.org/1.1/vocab/unit#>";
	prefix += " prefix mqtt:<http://wot.arces.unibo.it/mqtt#>";
	prefix += " prefix gn:<http://www.geonames.org/ontology#>";
	prefix += " prefix xsd:<http://www.w3.org/2001/XMLSchema#>";
	prefix += " prefix rdfs:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>";
	prefix += " prefix wgs84_pos:<http://www.w3.org/2003/01/geo/wgs84_pos#>";
	prefix += " prefix time:<http://www.w3.org/2006/time#>";
	prefix += " prefix sosa:<http://www.w3.org/ns/sosa/>";
				
	default_graph_uri = "http://wot.arces.unibo.it/monitor/mqtt/log";
	
	utc = new Date();
	dateTo = new Date(utc.getTime()+2*3600*1000)
	dateFrom = new Date(dateTo.getTime()-24*3600*1000);
	
	console.log(dateTo.toISOString());
	console.log(dateFrom.toISOString());
	
	from = dateFrom.toISOString();
	from = from.substring(0,from.length-1);
	console.log(from);
	
	to = dateTo.toISOString();
	to = to.substring(0,to.length-1);
	console.log(to);

//+ "UNION" + queries[1]


	query = prefix
			+ " "
			+ "SELECT * WHERE {"+ queries  + "FILTER(xsd:dateTime(?timestamp) > '"+from+"'^^xsd:dateTime && xsd:dateTime(?timestamp) < '"+to+"'^^xsd:dateTime)} ORDER BY ?timestamp"

	url = "http://"+host+":8000/query?query=" + encodeURIComponent(query)
			+ "&default-graph-uri=" + encodeURIComponent(default_graph_uri)
	xmlHttp.open("GET", url, true); // true for asynchronous

	xmlHttp.setRequestHeader("Accept", "application/sparql-results+json");
	xmlHttp.setRequestHeader("Content-Type", "application/sparql-query");

	xmlHttp.send(null);
}

var timer = window.setInterval(waitingTimer, 1000);
var seconds = 0;

function waitingTimer() {
	seconds += 1;
	document.getElementById('waiting').innerHTML = "<h2>Loading data...please wait...(elapsed seconds: "
			+ seconds + ")</h2>";
}

function results(json) {
	var traces = [];
	var layouts = [];

	
	window.clearInterval(timer);
	jsapObj = JSON.parse(json);

	for (i in variables) {
		var trace = {
			x : [],
			y : [],
			name : variables[i],
			line : {
				width : 2,
				color : colors[i]
			},
			type : 'scatter'
		};
		traces.push(trace);



		layouts.push({
			title : titles[i],
			titlefont : {
				family : 'Verdana',
				size : 24,
				color : 'rgb(17,57,177)'
			},
			color : colors[i],
			tickfont : {
				family : 'Verdana',
				size : 10
			}
		});
	}


	for (index in jsapObj.results.bindings) {
		timestamp = jsapObj.results.bindings[index].timestamp.value;
		binding = jsapObj.results.bindings[index];
		for (i in traces) {
			if (binding[traces[i].name] == undefined) continue;
			
			value = binding[traces[i].name].value;
			traces[i].x.push(timestamp);
			traces[i].y.push(value);

			if (max[i] == undefined) {
				max[i] = value;
				min[i] = value;
			}
			else {
				if (value > max[i]) max[i] = value;
				else if (value < min[i]) min[i] = value;
			}
			
			if (i != "0") {
				index = parseInt(i, 10) + 1;
				traces[i].yaxis = "y" + index;
				
				if (i == 1) {
					layout.yaxis2.range[0] = min[i];
					layout.yaxis2.range[1] = max[i];
				} else if (i == 2) {
					layout.yaxis3.range[0] = min[i];
					layout.yaxis3.range[1] = max[i];
				}
			}
			else {
				layout.yaxis.range[0] = min[i];
				layout.yaxis.range[1] = max[i];
			}
		}
	}

	// Overview (all traces)
	var data = [];
	for (i in traces) {
		data.push(traces[i]);
	}
	var element = document.createElement("div");
	element.id = "all";
	document.getElementById('plot').appendChild(element);
	
	Plotly.newPlot("all", data, layout);

	// Trace by trace
	for (i in traces) {
		var element = document.createElement("div");
		element.id = traces[i].name;
		document.getElementById('plot').appendChild(element);

		var data = [ traces[i] ];
		Plotly.newPlot(traces[i].name, data, layouts[i]);
	}
}