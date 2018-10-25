let a = [];
let y = window.opener.tit;
var max =[];
var min = [];

	let queries = "{?log arces-monitor:refersTo arces-monitor:"+ window.opener.x +" ; qudt-1-1:numericValue ?value; time:inXSDDateTimeStamp ?timestamp}";

var host ="mml.arces.unibo.it";

var s = new ColorScheme;
var colors = s.from_hue(10).scheme('analogic').variation("pastel").distance(0.5).colors();

var layout = {
    title : y,
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
		color : colors[0],
		tickfont : {
			family : 'Verdana',
			size : 10,
			color : colors[0]
		}
	},
    width: 0.9 * window.innerWidth,
    height: 0.7 * window.innerHeight
};

function queryLiveData(callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(xmlHttp.responseText);
	};

	prefix = "prefix arces-monitor:<http://wot.arces.unibo.it/monitor#>";
    prefix += " prefix schema:<http://schema.org/>";
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

    var form ="<form id=\"calendar\">\n" +
        "        Date from: <input type=\"date\" name=\"dateFrom\"><br>\n" +
        "        Time from: <input type=\"time\" name=\"timeFrom\"><br>\n" +
        "        Date to: <input type=\"date\" name=\"dateTo\"><br>\n" +
        "        Time to: <input type=\"time\" name=\"timeTo\"><br>\n" +
        "        </form>";

    var buttonCambia = "<button type=\"submit\" class=\"btn\">Go</button>";

    $("#form").append(form);
    $("#buttonCambia").append(buttonCambia);

        utc = new Date();
        dateTo = new Date(utc.getTime()+2*3600*1000);
        dateFrom = new Date(dateTo.getTime()-24*3600*1000);

        from = dateFrom.toISOString();
        from = from.substring(0,from.length-1);
        console.log(from);

        to = dateTo.toISOString();
        to = to.substring(0,to.length-1);
        console.log(to);


    $('#buttonCambia').click(function() {

        var timeAndDate = $('#calendar').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        console.log(timeAndDate.dateFrom + "T" + timeAndDate.timeFrom + ":00");

            from = timeAndDate.dateFrom + "T" + timeAndDate.timeFrom + ":00";
            to = timeAndDate.dateTo + "T" + timeAndDate.timeTo + ":00";

        query = prefix
            + " "
            + "SELECT * WHERE {" + queries  + "FILTER(xsd:dateTime(?timestamp) > '" + from + "'^^xsd:dateTime && xsd:dateTime(?timestamp) < '" + to + "'^^xsd:dateTime)} ORDER BY ?timestamp";

        url = "http://"+host+":8000/query?query=" + encodeURIComponent(query)
            + "&default-graph-uri=" + encodeURIComponent(default_graph_uri);
        xmlHttp.open("GET", url, true); // true for asynchronous
        xmlHttp.setRequestHeader("Accept", "application/sparql-results+json");
        xmlHttp.setRequestHeader("Content-Type", "application/sparql-query");
        xmlHttp.send(null);
    });

	query = prefix
			+ " "
			+ "SELECT * WHERE {" + queries  + "FILTER(xsd:dateTime(?timestamp) > '" + from + "'^^xsd:dateTime && xsd:dateTime(?timestamp) < '" + to + "'^^xsd:dateTime)} ORDER BY ?timestamp"

    console.log(query);

	url = "http://"+host+":8000/query?query=" + encodeURIComponent(query)
			+ "&default-graph-uri=" + encodeURIComponent(default_graph_uri);
	xmlHttp.open("GET", url, true); // true for asynchronous
	xmlHttp.setRequestHeader("Accept", "application/sparql-results+json");
	xmlHttp.setRequestHeader("Content-Type", "application/sparql-query");
	xmlHttp.send(null);
}

var timer = window.setInterval(waitingTimer, 1000);
var seconds = 0;

function waitingTimer() {
	seconds += 1;
	document.getElementById('waiting').innerHTML = "<h3 id='load'>Loading data...please wait...(elapsed seconds: "
			+ seconds + ")</h3>";
}

function results(json) {
	var traces = [];
	var layouts = [];

	window.clearInterval(timer);
	jsapObj = JSON.parse(json);

	// This was supposed to be used to visualize multiple graphs. Now we have just one graph to show.
	//for (i in a) {
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
			title : y,
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
	//}

	for (index in jsapObj.results.bindings) {
		timestamp = jsapObj.results.bindings[index].timestamp.value;
		binding = jsapObj.results.bindings[index];

		for (i in traces) {
            if (binding[traces[i].name] === undefined) continue;
			value = binding[traces[i].name].value;
			traces[i].x.push(timestamp);
			traces[i].y.push(value);

			if (max[i] === undefined) {
				max[i] = value;
				min[i] = value;
			}
			else {
				if (value > max[i]) max[i] = value;
				else if (value < min[i]) min[i] = value;
			}

			if (i !== "0") {
				index = parseInt(i, 10) + 1;
				traces[i].yaxis = "y" + index;

				if (i === 1) {
					layout.yaxis2.range[0] = min[i];
					layout.yaxis2.range[1] = max[i];
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

	Plotly.newPlot("plot", data, layout);

	// Trace by trace
	for (i in traces -1) {
		var data = [ traces[i] ];
		Plotly.newPlot(traces[i].name, data, layouts[i]);
	}

    window.onresize = function() {
        Plotly.relayout("plot", {
            width: 0.9 * window.innerWidth,
            height: 0.7 * window.innerHeight
        })
    }
}


