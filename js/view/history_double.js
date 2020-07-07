let lastHours = 24;

let a = [];
var max = [];
var min = [];

var s = new ColorScheme;

// Using a fixed palette
var colors = ["#FF0000","#0000FF"]

var csvData;

var observation = [];
var title;
var calendarFrom,calendarTo;
const selection = [];
var traces = [];
const axisLabels = ["y", "y2"]

var place = null;
var tz = "UTC";
var localTzOffset = 0;
var remoteTzOffset = 0;
var tzOffset = 0;

function changeHistoryTimeZone() {
	var newTz = document.getElementById("historyTimeZone").value;
	
	var from = moment(calendarFrom.selectedDates[0]);
	var to = moment(calendarTo.selectedDates[0]);
	
	if (tz == "UTC") {	
		if (newTz == "Local") {
			tzOffset = localTzOffset;
		}
		else {
			tzOffset = remoteTzOffset;
		}
	} else if (tz == "Local") {
		if (newTz == "UTC") {
			tzOffset = -localTzOffset;
		}
		else {
			tzOffset =  remoteTzOffset - localTzOffset;
		}
	} else {
		if (newTz == "UTC") {
			tzOffset = -remoteTzOffset;
		}
		else {
			tzOffset =  localTzOffset - remoteTzOffset;
		}
	}
	
	tz = newTz;
	
	if (tzOffset == 0) return;
	
	from.add(tzOffset,'m');
	to.add(tzOffset,'m');
	
	calendarFrom.setDate(new Date(from.format()));
	calendarTo.setDate(new Date(to.format()));	
	
	for (trace of traces) {
		for (i=0 ; i < trace.x.length; i++) {
			var timestamp = moment(trace.x[i]).utc();
			timestamp.add(tzOffset,'m');
			trace.x[i] = timestamp.format();
		}
	}
	
	Plotly.newPlot("plot", traces, layout);	
}

var layout = {
	title : "Loading data...please wait...",
	mode: 'lines+markers',
	legend: {"orientation": "h", "x" : 0.25},
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
			size : 18,
			color : colors[0]
		},
		title: 'yaxis',
		showgrid: true,
	    zeroline: false,
	    showline: false
	},
	yaxis2: {
		title: 'yaxis2',
		color : colors[1],
		//titlefont: { color: 'rgb(148, 103, 189)' },
		tickfont: {
			family: 'Verdana',
			size: 18,
			color: colors[1]
		},
		overlaying: 'y',
		side: 'right',
		showgrid: true,
		zeroline: false,
		showline: false
	},
	margin: {
	    autoexpand: true,
	    l: 0,
	    b : 75
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
	// Init plot
	Plotly.newPlot("plot", [], layout, { responsive: true });

	loadPlaceTree().then((tree) => {
		$('#observations').treeview({
			data: tree, 
			levels: 1, // Define how many levels to expand
			multiSelect : true, 
			expandIcon: "fas fa-plus",
			collapseIcon: "fas fa-minus",
			onNodeSelected: function (event, data) {
				selectObservation(data)
			},

			onNodeUnselected: function (event,data) {
				unselectObservation(data)
			}
		});
		console.log();
		
		for (const obs of observation) {
			const nodes =  $('#observations').treeview(true).findNodes(obs, "uri")
			$('#observations').treeview(true).toggleNodeSelected(nodes)
			$('#observations').treeview(true).revealNode(nodes)
		}

	})
	
	var parameters = window.location.search.substring(1).split("&");

	var i;
	for (i=0; i < parameters.length; i++) {
		switch(parameters[i].split("=")[0]) {
		case "observation":
			observation = decodeURIComponent(parameters[i].split("=")[1]).split(",");
			break;
		case "title":
			title = unescape(unescape(parameters[i].split("=")[1]));
			break;
		case "place":
			place = decodeURIComponent(parameters[i].split("=")[1]);
			break;
		}
	}
	
	layout.title = title;
	
	// TODO: use updateFormUI
	 if (place != null) $("#form").append("<input type='hidden' name='place' value=\""+place+"\" />");

	 var to = moment(); 
	 var from = moment();
	 
	 to.subtract(to.utcOffset(),'m'); 
	 from.subtract(from.utcOffset(),'m');		 
	 from.subtract(1,'days');
	
	 to = new Date(to.format()); 
	 from = new Date(from.format());
	 
	calendarFrom = flatpickr("#from", {
		mode : "single",
		enableTime : true,
		defaultDate: [from],
		time_24hr : true
	});
	
	calendarTo = flatpickr("#to", {
		mode : "single",
		enableTime : true,
		defaultDate: [to],
		time_24hr : true
	});

	
	// Remote TZ (from observation lat & lon)
	var request = new XMLHttpRequest()

	request.open('GET', 'http://api.timezonedb.com/v2.1/get-time-zone?key=BXF3O46O8VBW&format=json&by=position&lat=44.776585&lng=10.717520', true)
	request.onload = function() {
	  // Begin accessing JSON data here
	  var data = JSON.parse(this.response)

	  if (request.status >= 200 && request.status < 400) {
		  remoteTzOffset = data["gmtOffset"]/60;
	  } else {
	    console.log('error')
	  }
	}

	request.send()
	
	localTzOffset = moment().utcOffset();
}

function selectObservation(node) {
	if (selection.length > 1) {
		const oldNode = selection.shift();
		const t = $('#observations').treeview(true)
		
		// oldNode is just a clone of the real node contained inside the tree.
		// finding the node retrieves the real one.
		const treeNode = t.findNodes(oldNode.nodeId,"nodeId")
		t.toggleNodeSelected(treeNode,{silent:true})
	}

	selection.push(node)
	
	updateUIForm()
	
	doQuery(node.uri)
		.then((data) => {
			data.name = node.text;
			updateTraces(data,node.symbol);
			Plotly.newPlot("plot", traces, layout);
		})
}

function unselectObservation(node) {
	if(selection.length < 2){
		traces.pop() 
		selection.pop()
		Plotly.newPlot("plot", traces, layout);
		return
	} 

	if(node.nodeId === selection[0].nodeId){
		traces.shift()
		selection.shift()
	}else{
		traces.pop()
		selection.pop()
	}

	updateUIForm()
	
	Plotly.newPlot("plot", traces, layout);
}

function updateUIForm() {
	let obs = ""
	let title = ""
	
	for (const node of selection) {
		obs += node.uri + ","
		title += `${node.text} & `
	}

	obs = obs.substr(0, obs.length - 1)
	title = title.substr(0,title.length -3)
	layout.title = title

	$("#form > input[name='observation']").attr("value", obs)
	$("#form > input[name='title']").attr("value", escape(title))
}

function doQuery(observation) {
	console.log("Calendar from: "+calendarFrom.selectedDates[0]);
	console.log("Calendar to: "+calendarTo.selectedDates[0]);
	
	if (tz == "UTC") {
		from = flatpickr.formatDate(calendarFrom.selectedDates[0],"Y-m-dTH:i\\Z");
		to = flatpickr.formatDate(calendarTo.selectedDates[0],"Y-m-dTH:i\\Z");
	}
	else if (tz == "Local") {
		from = calendarFrom.selectedDates[0].toISOString();
		to = calendarTo.selectedDates[0].toISOString();
	}
	else {
		
	}
	
	console.log("Observation: "+observation);
	console.log("From: "+from);
	console.log("To: "+to);
	
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
		 return results(data);
	 });	
}

function onRefresh() {
	traces = []

	doQuery(selection[0].uri)
		.then((data) => {	
			data.name = selection[0].text
			updateTraces(data, selection[0].symbol)
			// Plotly.newPlot("plot", traces, layout);
		}).then(() => {
			if (selection[1] != undefined){
			doQuery(selection[1].uri)
				.then((data) => {
					data.name = selection[1].text
					updateTraces(data, selection[1].symbol)
					Plotly.newPlot("plot", traces, layout);
				})
			}
			else {
				Plotly.newPlot("plot", traces, layout);
			}
		})	

}

function updateTraces(newTrace,unit) {
	const layoutAxisKeys = ["yaxis","yaxis2"]
	newTrace.unit = unit
	
	if (traces.length > 1) {
		traces.shift()
	}
	traces.push(newTrace)

	for (let i = 0; i < traces.length; i++) {
		traces[i].line.color = colors[i]
		traces[i].yaxis = axisLabels[i]
		layout[layoutAxisKeys[i]].title = traces[i].unit
	}
}

function results(jsapObj) {
	
	var trace = {
		x : [],
		y : [],
		line : {
			width : 2.25,
		},
		type : 'scatter'
	};
	
	
	csvData = [];

	for (binding of jsapObj.results.bindings) {
		timestamp = binding.timestamp.value;
		value = parseFloat(binding.value.value);
		
		// CSV
		csvData.push([timestamp,value]);
			
		traceTime = moment(timestamp).utc();
		traceTime.add(tzOffset,'m');
// // Format date according to TZ
// if (tz == "UTC"){
// //traceTime = flatpickr.parseDate(timestamp,"Y-m-dTH:i\\Z");
// traceTime = timestamp;
// }
// else if (tz == "Local") {
// var t = moment(timestamp);
// t.
// }
// else if (tz == "Remote") {
//				
// }
					
		trace.x.push(traceTime.format());
		trace.y.push(value);		
	}

	return trace
}