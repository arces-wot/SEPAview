let observations = [];//, locations = [];
let sensorData = [ {
	"title" : "Notifications",
	"subtitle" : "",
	"measures" : [ 0, 0 ],
	"ranges" : [ 0, 10 ],
	"markers" : [ 0 ],
	"location" : "",
    "quantities" : ""
} ];


let margin = {
	top : 0,
	right : 10,
	bottom : 30,
	left : 5
}, width = 960 - margin.left - margin.right, height = 75 - margin.top
		- margin.bottom;

let chart = d3.bullet().width(width).height(height);

let notifications = 0;
let svg;

function drawData(data) {
    loc = countLocation(data);
	let i = 0;

    for(; i <= loc.length - 1; i++){
    	if(loc[i] === ""){
            let a = divideData(data, "");
            createSvg(a,"#plot");




		}else{
            let b = divideData(data, loc[i]);
            createSvg(b,loc[i]);



		}
	}
}

function redrawData(data) {
	let svg = d3.select("body").selectAll("svg").data(data);
	svg.datum(randomize).call(chart.duration(1000));
}

function randomize(d) {
	return d;
}

function updateData(observation, value, label, unit, location, quantity) {
	index = observations.indexOf(observation);

	console.log("Plot <" + observation + ":" + value + ">  index:" + index);

	valueAsFloat = parseFloat(value);
	
	if (index == -1) {
		observations.push(observation);

		if (unit.endsWith("Percent")) title = label + " (%)";
		else if (unit.endsWith("DegreeCelsius")) title = label + " (°C)";
		else if (unit.endsWith("Millibar")) title = label + " (mBar)";


		sensorData.push({
			"title" : title,
			"subtitle" : observation,
			"ranges" : [ valueAsFloat, valueAsFloat, valueAsFloat*2 ],
			"measures" : [valueAsFloat, valueAsFloat ],
			"markers" : [ valueAsFloat, valueAsFloat ],
			"location" : location,
			"quantities" : quantity
		});
		drawData(sensorData);


	} else {
		index = index + 1;

		sensorData[index]["measures"][0] = valueAsFloat;

		if (valueAsFloat < sensorData[index]["markers"][0]) {
			sensorData[index]["markers"][0] = valueAsFloat;
			sensorData[index]["ranges"][0] = valueAsFloat;
		}
		else if (valueAsFloat > sensorData[index]["markers"][1]) {
			sensorData[index]["markers"][1] = valueAsFloat;
			sensorData[index]["ranges"][1] = valueAsFloat;
			sensorData[index]["measures"][1] = valueAsFloat;
			if (valueAsFloat > sensorData[index]["ranges"][2]) sensorData[index]["ranges"][2] = sensorData[index]["ranges"][2] * 2;
		}

		// Notifications
		notifications = notifications + 1;

		sensorData[0]["measures"][0] = notifications;
		sensorData[0]["markers"][1] = notifications;
		if (notifications > sensorData[0]["ranges"][1]) {
			sensorData[0]["ranges"][1] = sensorData[0]["ranges"][1] * 2;
		}

		redrawData(sensorData);
	}


};



