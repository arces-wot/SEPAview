let a = [];
var max = [];
var min = [];

var s = new ColorScheme;

// Using a fixed palette
var colors = ["#2980b9", "#16a085"]

var foi;
var property;

var title;
var symbol;
var placeZone;

var calendarFrom, calendarTo;

var traces = [];
const axisLabels = ["y"]
var timestamps = []

var layout = {
	title: "Loading data...please wait...",
	mode: 'markers',
	xaxis: {
		domain: [0.15, 1.0],
		showgrid: true,
		zeroline: false,
		showline: false
	},
	titlefont: {
		family: 'Verdana',
		size: 22,
		color: 'rgb(16,125,246)'
	},
	yaxis: {
		range: [],
		color: colors[0],
		tickfont: {
			family: 'Verdana',
			size: 16,
			color: colors[0]
		},
		title: 'yaxis',
		showgrid: true,
		zeroline: false,
		showline: false
	},
	margin: {
		l: 0
	}
};

function getCalendarDates() {
	calendar = [];
	calendar.push(calendarFrom.selectedDates[0]);
	calendar.push(calendarTo.selectedDates[0]);

	return calendar;
}

function onLoadHistory() {
	// Init SEPA
	initSepa();

	// Init plot
	Plotly.newPlot("plot", [], layout, { responsive: true });

	var parameters = window.location.search.substring(1).split("&");

	var i;
	for (i = 0; i < parameters.length; i++) {
		if (parameters[i].indexOf("=") < 0) continue;
		
		switch (parameters[i].split("=")[0]) {
			case "property":
				property = decodeURIComponent(parameters[i].split("=")[1]).split(",");
				break;
			case "title":
				title = unescape(unescape(parameters[i].split("=")[1]));
				break;
			case "foi":
				foi = decodeURIComponent(parameters[i].split("=")[1]).split(",");
				break;
			case "symbol":
				symbol = unescape(unescape(parameters[i].split("=")[1]));
				break;
			case "lat":
				lat = unescape(unescape(parameters[i].split("=")[1]));
				break;
			case "long":
				long = unescape(unescape(parameters[i].split("=")[1]));
				break;
		}
	}

	layout.title = "Device: "+foi + " Observed property: " + title;

	if (property == undefined || title == undefined || foi == undefined || lat == undefined || long == undefined || symbol == undefined) return;

	placeZone = tzlookup(parseFloat(lat), parseFloat(long));

	interval = initCalendar(1,'days');

	calendarFrom = flatpickr("#from", {
		mode: "single",
		enableTime: true,
		defaultDate: [interval[0]],
		time_24hr: true,
		enableSeconds : true
	});

	calendarTo = flatpickr("#to", {
		mode: "single",
		enableTime: true,
		defaultDate: [interval[1]],
		time_24hr: true,
		enableSeconds : true
	});

	onRefresh();
}

function onRefresh24h() {
	interval = initCalendar(1,'days');

	calendarFrom = flatpickr("#from", {
		mode: "single",
		enableTime: true,
		defaultDate: [interval[0]],
		time_24hr: true,
		enableSeconds : true
	});

	calendarTo = flatpickr("#to", {
		mode: "single",
		enableTime: true,
		defaultDate: [interval[1]],
		time_24hr: true,
		enableSeconds : true
	});

	onRefresh();
}

function onRefresh1h() {
	interval = initCalendar(1,'hours');

	calendarFrom = flatpickr("#from", {
		mode: "single",
		enableTime: true,
		defaultDate: [interval[0]],
		time_24hr: true,
		enableSeconds : true
	});

	calendarTo = flatpickr("#to", {
		mode: "single",
		enableTime: true,
		defaultDate: [interval[1]],
		time_24hr: true,
		enableSeconds : true
	});

	onRefresh();
}

function onRefresh1m() {
	interval = initCalendar(1,'minutes');

	calendarFrom = flatpickr("#from", {
		mode: "single",
		enableTime: true,
		defaultDate: [interval[0]],
		time_24hr: true,
		enableSeconds : true
	});

	calendarTo = flatpickr("#to", {
		mode: "single",
		enableTime: true,
		defaultDate: [interval[1]],
		time_24hr: true,
		enableSeconds : true
	});

	onRefresh();
}

function getHistoryPlaceZone() {
	return placeZone;
}

function initCalendar(n,period) {
	var to = moment();
	to.subtract(to.utcOffset(), 'm');
	var from = moment();
	from.subtract(from.utcOffset(), 'm');

	from.subtract(n, period);

	toDate = new Date(to.format());
	fromDate = new Date(from.format());

	interval = [];
	interval.push(fromDate);
	interval.push(toDate);

	return interval;
}

function doQuery() {
	console.log("Calendar from: " + calendarFrom.selectedDates[0]);
	console.log("Calendar to: " + calendarTo.selectedDates[0]);

	interval = setQueryInterval(calendarFrom.selectedDates[0], calendarTo.selectedDates[0]);

	console.log("FOI: " + foi);
	console.log("Property: " + property);
	console.log("From: " + interval["from"]);
	console.log("To: " + interval["to"]);

	return queryHistory(foi, property,interval["from"], interval["to"]).then((data) => {
		return results(data);
	});
}

function setQueryInterval(calendarFromDate, calendarToDate) {
	from = flatpickr.formatDate(calendarFromDate, "Y-m-dTH:i:S.000");
	to = flatpickr.formatDate(calendarToDate, "Y-m-dTH:i:S.000");

	tz = document.getElementById("selectTimeZone").value;

	if (tz == "Local") {
		from = moment(from);
		to = moment(to);
	} else if (tz == "UTC") {
		from = moment(from);
		from.add(from.utcOffset(), 'm');
		to = moment(to);
		to.add(from.utcOffset(), 'm');
	}
	else if (tz == 'Remote') {
		zone = placeZone;
		if (zone == "America/Sao_Paulo") {
			zone = "America/Belem"
		}

		from = moment(from);
		localeOffset = from.utcOffset();
		from.tz(zone);
		remoteOffset = from.utcOffset();
		from.add(localeOffset - remoteOffset, 'm');

		to = moment(to);
		localeOffset = to.utcOffset();
		to.tz(zone);
		remoteOffset = to.utcOffset();
		to.add(localeOffset - remoteOffset, 'm');
	}

	interval = {
		"from": from.toISOString(),
		"to": to.toISOString(),
	};

	return interval;
}

function onRefresh() {
	traces = []

	doQuery()
		.then((data) => {
			data.name = title;
			updateTraces(data, symbol)
			Plotly.newPlot("plot", traces, layout);
		});
}

function updateTraces(newTrace, unit) {
	const layoutAxisKeys = ["yaxis"]
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

function updateHistoryGraph() {
	for (let i = 0; i < traces.length; i++) {
		for (j = 0; j < traces[i].x.length; j++)
			traces[i].x[j] = getTraceTime(timestamps[j])
	}
//	Plotly.newPlot("plot", traces, layout);
	Plotly.newPlot("plot", traces);
}

function results(jsapObj) {

	var trace = {
		x: [],
		y: [],
		line: {
			width: 1.25,
		},
		type: 'scatter',
		mode: 'lines+markers'
	};

	clearCSVData();

	timestamps = [];

	for (binding of jsapObj.results.bindings) {
		timestamp = binding.timestamp.value;
		value = parseFloat(binding.value.value);

		addCSVData(timestamp, value);

		traceTime = getTraceTime(timestamp);

		trace.x.push(traceTime);
		trace.y.push(value);

		timestamps.push(timestamp);
	}

	return trace
}

function getTraceTime(timestamp) {
	traceTime = moment(timestamp).utc();

	tz = document.getElementById("selectTimeZone").value;

	if (tz == 'Local') {
		traceTime = moment(timestamp).tz(moment.tz.guess());
	} else if (tz == 'Remote') {
		zone = placeZone;
		if (zone == "America/Sao_Paulo") {
			zone = "America/Belem"
		}
		traceTime = moment(timestamp).tz(zone);
	}

	return traceTime.format();
}

function downloadHistory() {
	downloadCSV(layout.title)
}