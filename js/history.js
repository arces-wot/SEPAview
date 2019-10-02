let serverUTCOffset = 0;
let lastHours = 24;

let a = [];
var max = [];
var min = [];

var s = new ColorScheme;

// Using a fixed palette 
var colors = ["#2980b9","#16a085"]


var csvData;

var observation = [];
var title;
var calendar;
const selection = [];
var traces = [];
const axisLabels = ["y", "y2"]

var place = null;
var forecast = false;

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
	yaxis2: {
		title: 'yaxis2',
		titlefont: { color: 'rgb(148, 103, 189)' },
		tickfont: {
			family: 'Verdana',
			size: 16,
			color: colors[1]
		},
		overlaying: 'y',
		side: 'right',
		showgrid: true,
		zeroline: false,
		showline: false
	},
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
	//Init plot
	Plotly.newPlot("plot", [], layout, { responsive: true });

	loadPlaceTree().then((tree) => {
		$('#observations').treeview({
			data: tree, 
			levels: 1, //Define how many levels to expand
			multiSelect : true, 
			expandIcon: "fas fa-plus",
			collapseIcon: "fas fa-minus",
			onNodeSelected: function (event, data) {
				serverTo = new Date(calendarTo.selectedDates[0].getTime());
				
				serverFrom = new Date(calendarFrom.selectedDates[0].getTime());
			
				selectObservation(data,serverFrom,serverTo)
			},

			onNodeUnselected: function (event,data) {
				unselectObservation(data)
				Plotly.newPlot("plot", traces, layout);
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

    var localTo = new Date();
    var localFrom = new Date(localTo.getTime() - lastHours * 3600 * 1000);
    
	var i;
	for (i=0; i < parameters.length; i++) {
		switch(parameters[i].split("=")[0]) {
		case "observation":
			observation = decodeURIComponent(parameters[i].split("=")[1]).split(",");
			break;
		case "title":
			title = unescape(unescape(parameters[i].split("=")[1]));
			break;
		case "forecast":
			if (parameters[i].split("=")[1] == "true") forecast = true;
			break;
		case "place":
			place = decodeURIComponent(parameters[i].split("=")[1]);
			break;
		}
	}
	
	layout.title = title;
	
	// TODO: use updateFormUI
	 if (forecast) $("#form").append("<input type='hidden' name='forecast' value=\"true\" />");
	 if (place != null) $("#form").append("<input type='hidden' name='place' value=\""+place+"\" />");
	 
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
}

function selectObservation(node,from,to) {
	if (selection.length > 1) {
		const oldNode = selection.shift();
		const t = $('#observations').treeview(true)
		
		// oldNode is just a clone of the real node cotained inside the tree.
		// finding the node retrives the real one.
		const treeNode = t.findNodes(oldNode.nodeId,"nodeId")
		t.toggleNodeSelected(treeNode,{silent:true})
	} 

	selection.push(node)
	
	updateUIForm()

	retriveObservedData(node.uri, from.toISOString(), to.toISOString())
		.then((data) => {
			data.name = node.text

			updateTraces(data,node.symbol)
			Plotly.newPlot("plot", traces, layout);
		})
}

function unselectObservation(node) {
	if(selection.length < 2){
		traces.pop() 
		selection.pop()
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

}

function updateUIForm() {
	let obs = ""
	let title = ""
	
	for (const node of selection) {
		obs += node.uri + ","
		title += `${node.text}&`
	}

	obs = obs.substr(0, obs.length - 1)
	title = title.substr(0,title.length -1)
	layout.title = title

	$("#form > input[name='observation']").attr("value", obs)
	$("#form > input[name='title']").attr("value", escape(title))
}

function retriveObservedData(observation,from,to) {
	// TIMESTAMPS are stored as local time using now() of SPARQL (e.g. "2019-06-26T12:32:47.0023")
	if(forecast) return doForecastQuery(place, observation,from,to);
	else return doQuery(observation,from,to);
}

function doForecastQuery(place,property,from,to) {
	const sepa = Sepajs.client;

	// PREFIXES
	prefixes = "";
	for (ns in jsap["namespaces"]) {
		prefixes += " PREFIX " + ns + ":<" + jsap["namespaces"][ns]
				+ ">";
	}
	
	query = prefixes + " "
	+ jsap["queries"]["DAILY_FORECAST"]["sparql"];

	// Forced bindings
	query = query.replace("?place", "<"+place+">");
	query = query.replace("?property", "<"+property+">");
	query = query.replace("?from", "'" + from.substr(0,10) + "'");
	query = query.replace("?to", "'" + to.substr(0,10) + "'");

	console.log("FORECAST Place: "+place + " Property: "+property);
	console.log("From: "+from);
	console.log("To: "+to);
	 
	return sepa.query(query,jsap).then((data)=>{ 
		 return results(data);
	 });	
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
	 
	return sepa.query(query,jsap).then((data)=>{ 
		 return results(data);
	 });	
}

function onRefresh() {

	traces = []

	serverTo = new Date(calendarTo.selectedDates[0].getTime());

	serverFrom = new Date(calendarFrom.selectedDates[0].getTime());

	retriveObservedData(selection[0].uri, serverFrom.toISOString(), serverTo.toISOString())
		.then((data) => {
			data.name = selection[0].text

			updateTraces(data, selection[0].symbol)
			Plotly.newPlot("plot", traces, layout);
		}).then(() => {
			retriveObservedData(selection[1] ? selection[1].uri : undefined, serverFrom.toISOString(), serverTo.toISOString())
				.then((data) => {
					data.name = selection[1].text

					updateTraces(data, selection[1].symbol)
					Plotly.newPlot("plot", traces, layout);
				})
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
			width : 1.25,
		},
		type : 'scatter',
	};
	
	
	csvData = [];

	for (binding of jsapObj.results.bindings) {
		timestamp = binding.timestamp.value;

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

function redirectMap() {
	var parentId = selection[0].parentId;	//ottengo la radice dell'elemento selezionato

	location.href = "../Sepaview/index.html";	//redirect nella pagina html

	var long = 2.717520;
	var lat = 20.776585;	//da modificare con i valori della radice selezionata

	localStorage.setItem('lat', lat);
	localStorage.setItem('long', long);		/*inserisco nell'oggetto localstorage le due variabili con le chiavi rispettive,
											uso queste perchè i dati allocati persistono nelle diverse sessioni*/
}