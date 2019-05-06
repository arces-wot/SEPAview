let a = [];
var max = [];
var min = [];

var s = new ColorScheme;
var colors = s.from_hue(10).scheme('analogic').variation("pastel")
		.distance(0.5).colors();

var layout = {
	title : "Title",
	xaxis : {
		domain : [ 0.15, 1.0 ]
	},
	titlefont : {
		family : 'Verdana',
		size : 24,
		color : 'rgb(17,57,177)'
	},
	yaxis : {
		range : [],
		color : colors[0],
		tickfont : {
			family : 'Verdana',
			size : 10,
			color : colors[0]
		}
	},
	width : 0.9 * window.innerWidth,
	height : 0.7 * window.innerHeight
};

function queryLiveData(observation,title) {
	layout.title = title;

    utc = new Date();
    dateTo = new Date(utc.getTime() + 2 * 3600 * 1000);
    dateFrom = new Date(dateTo.getTime() - 24 * 3600 * 1000);

    from = dateFrom.toISOString();
    from = from.substring(0, from.length - 1);
    console.log("FROM: "+from);

    to = dateTo.toISOString();
    to = to.substring(0, to.length - 1);
    console.log("TO: "+to);
	
	 var form = "<form id=\"calendar\">\n"
			+ " Date from: <input type=\"date\" name=\"dateFrom\" value='"+ from.slice(0,10) +"'><br>\n"
			+ " Time from: <input type=\"time\" name=\"timeFrom\" value='"+ from.slice(11,16) +"'><br>\n"
			+ " Date to: <input type=\"date\" name=\"dateTo\" value='"+ to.slice(0,10) +"'><br>\n"
			+ " Time to: <input type=\"time\" name=\"timeTo\" value='"+ to.slice(11,16) +"'><br>\n"
			+ " </form>";

	var buttonCambia = "<button type=\"submit\" class=\"btn\">Go</button>";

	$("#form").append(form);
	$("#buttonCambia").append(buttonCambia);

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

	 sepa.query(query,jsap).then((data)=>{ 
		 results(data);
	 });
	 
	$('#buttonCambia').click(
			function() {

				var timeAndDate = $('#calendar').serializeArray().reduce(
						function(obj, item) {
							obj[item.name] = item.value;
							return obj;
						}, {});

				from = timeAndDate.dateFrom + "T" + timeAndDate.timeFrom + ":00";
				to = timeAndDate.dateTo + "T" + timeAndDate.timeTo + ":00";

				query = prefixes + " "
						+ jsap["queries"]["LOG_QUANTITY"]["sparql"];

				// Forced bindings
				query = query.replace("?observation", "<"+observation+">");
				query = query.replace("?from", "'" + from + "'^^xsd:dateTime");
				query = query.replace("?to", "'" + to + "'^^xsd:dateTime");
				
				 sepa.query(query,jsap).then((data)=>{ 
					 results(data);
				 });
			});
    $('#loader_wrap').addClass("hide-loader");
}

var timer = window.setInterval(waitingTimer, 1000);
var seconds = 0;

function waitingTimer() {
	seconds += 1;
	document.getElementById('waiting').innerHTML = "<h3 id='load'>Loading data...please wait...(elapsed seconds: "
			+ seconds + ")</h3>";
}

function results(jsapObj) {
	var traces = [];
	var layouts = [];

	window.clearInterval(timer);

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
			size : 24,
			color : 'rgb(17,57,177)'
		},
		color : colors[0],
		tickfont : {
			family : 'Verdana',
			size : 10
		}
	});
	// }

	for (binding of jsapObj.results.bindings) {
		timestamp = binding.timestamp.value;

		for (i in traces) {
			if (binding[traces[i].name] === undefined)
				continue;
			
			value = parseFloat(binding[traces[i].name].value);
			
			traces[i].x.push(timestamp);
			traces[i].y.push(value);

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
