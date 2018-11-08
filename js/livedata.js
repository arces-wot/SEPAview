// Grouped by location and observation
// {"location_uri1": {
//		"div_id" : "ID",
// 		"observation_uri1" : {"div_id": "ID" , "data" : [{"title": ... , "subtitles" : ...}]},
//		"..." : {...}
//   "location_uri2" : {...}
//  }
sensorData = {};

notifications = [ {
	"title" : "Notifications",
	"subtitle" : "(Added bindings)",
	"measures" : [ 0, 0 ],
	"ranges" : [ 0, 10 ],
	"markers" : [ 0 ],
	"place" : "",
	"quantity" : ""
} ];

let margin = {
	top : 0,
	right : 10,
	bottom : 30,
	left : 5
}, width = 960 - margin.left - margin.right, height = 75 - margin.top
		- margin.bottom;

let chart = d3.bullet().width(width).height(height);
let svg;

function liveMonitor() {
	createNotificationsSvg();
	
	const Jsap = Sepajs.Jsap;
	
	app = new Jsap(jsap);

	app.OBSERVATIONS({},data => {
		msg = JSON.parse(data);
		
		if (msg["notification"] !== undefined) {
            added = msg["notification"]["addedResults"]["results"]["bindings"].length;
            
            for (index = 0; index < added; index++) {
                binding = msg.notification.addedResults.results.bindings[index];

                // Check value validity
                if (binding.value.value == "NaN") continue;
                valueAsFloat = parseFloat(binding.value.value);
                
                let place = binding.place.value;
                let unit = binding.unit.value;
                let label = binding.label.value;
				let observation = binding.observation.value;
				let quantity = 	binding.quantity.value;

				console.log("Place: "+place+" Observation: "+observation);
                	
                // NEW PLACE
                if (sensorData[place] === undefined) {
                	    sensorData[place] = {};
                	    
                	    if (placeIds[place] === undefined) {
                	    		placeIds[place] = generateID();
                	    }
                	    sensorData[place]["div_id"] = placeIds[place];
                	    
                	    addPlace(sensorData[place]["div_id"],binding.placeName.value);
                }
                
                // NEW OBSERVATION
                if (sensorData[binding.place.value][binding.observation.value] === undefined) {
		            	// TODO: to be replaced with rdfs:label from qu-unit
		        		if (unit.endsWith("Percent")) title = label + " (%)";
		        		else if (unit.endsWith("DegreeCelsius")) title = label + " (°C)";
		        		else if (unit.endsWith("Millibar")) title = label + " (mBar)";
		        		
		        		sensorData[place][observation] = {};
		        		sensorData[place][observation]["div_id"] = generateID();
		        		sensorData[place][observation]["data"] = [];
		        		
		        		sensorData[place][observation]["data"].push({
	            			"title" : title,
	            			"subtitle" : observation,
	            			"ranges" : [ valueAsFloat, valueAsFloat, valueAsFloat*2 ],
	            			"measures" : [valueAsFloat, valueAsFloat ],
	            			"markers" : [ valueAsFloat, valueAsFloat ],
	            			"quantity" : quantity
	            		});


		        		addObservation(observation,place,sensorData[place][observation]["data"]);
                }
                	   
	            // UPDATE data
                updateObservation(observation,place,valueAsFloat);
                
                updateNotifications();
            }
		}
	});
}

function createNotificationsSvg() {
	$("#plot").append("<div id='notifications' style='margin-bottom: 30px'></div>");
	
    let svg = d3.select("#notifications").selectAll("svg").data(notifications).enter().append(
    "svg").attr("class", "bullet").style("margin-top","30px").attr("width",
    width + margin.left + margin.right).attr("height",
    height + margin.top + margin.bottom).append("g").attr("transform",
    "translate(" + margin.left + "," + margin.top + ")").call(chart);

	let title = svg.append("g").style("text-anchor", "end").attr("transform",
	    "translate(940,27)");
	
	title.append("text").attr("class", "title").text(function(d) {
	    return d.title;
	});
	
	title.append("text").attr("class", "subtitle").attr("dy", "1em").text(
	    function(d) {
	        return d.subtitle;
	    });
}
/*id='"+ place_id + "_closeButton_" + name +"'*/

function addPlace(place_id, name) {
	cls_btn_id = place_id + "_closeButton_" + name;
    //div_btn_e_titolo_id = place_id + "_closeButtonETitolo_" + name + "_div";

    $("#graph").append("<div class='graph' id='"+place_id+"'><h2>"+name+"</h2></div>");
    //$("#"+place_id).append("<div id='"+ div_btn_e_titolo_id +"'></div>");
    $("#"+place_id).append("<a href=\"javascript:void(0)\" id=\"" + cls_btn_id +"\"" +
		"class=\"closebtn\" onClick=\"closeDiv($(this).parent().attr('id'))\"" +
		"style=''>&times;</a>");
	// Hide place
	$("#"+place_id).hide();


}

function addObservation(observation,place,data){
	let obs_id = sensorData[place][observation]["div_id"];
	
	$("#"+sensorData[place]["div_id"]).append("<div id='"+obs_id+"' style='margin-bottom: 20px'></div>");
	
    let svg = d3.select("#"+obs_id).selectAll("svg").data(data).enter().append(
        "svg").attr("class", "bullet").style("margin-top","30px").attr("width",
        width + margin.left + margin.right).attr("height",
        height + margin.top + margin.bottom).append("g").attr("transform",
        "translate(" + margin.left + "," + margin.top + ")").call(chart);

    let title = svg.append("g").style("text-anchor", "end").attr("transform",
        "translate(940,27)");

    title.append("text").attr("class", "title").text(function(d) {
        return d.title;
    });

    title.append("text").attr("class", "subtitle").attr("dy", "1em").text(
        function(d) {
            return d.subtitle;
        });
    
    $("#"+obs_id).append("<div id='button_"+obs_id+"' class='div_button' style='position:relative;height:50px;" +
		"width: 130px;border: #020202 1px solid; " + "margin-left: 45%;'></div>");
	$("#button_"+obs_id).append("<a id=a_'"+ obs_id +"' " +
		"data-quantity='"+sensorData[place][observation]["data"]["quantity"]+ "'" +
		"data-title='"+ sensorData[place][observation]["data"]["title"] +"'" +
		" class='button' href='./indexAnalitics.html' target='_blank' >HISTORY</a>");
	
	let buttons = document.getElementsByClassName("button");
    let buttonsCount = buttons.length;
    for (let j = 0; j < buttonsCount; j++) {
        buttons[j].onclick = function() {
            x = this.dataset.quantity;
            tit = this.dataset.title;
        }
    }
}

function updateObservation(observation,place,valueAsFloat) {
	let data = sensorData[place][observation]["data"][0];
	
	data["measures"][0] = valueAsFloat;
	
	if (valueAsFloat < data["markers"][0]) {
		data["markers"][0] = valueAsFloat;
		data["ranges"][0] = valueAsFloat;
	}
	else if (valueAsFloat > data["markers"][1]) {
		data["markers"][1] = valueAsFloat;
		data["ranges"][1] = valueAsFloat;
		data["measures"][1] = valueAsFloat;
		if (valueAsFloat > data["ranges"][2])
			data["ranges"][2] = data["ranges"][2] * 2;
	}
	
	redrawSvg(sensorData[place][observation]["div_id"],sensorData[place][observation]["data"]);
}

function updateNotifications() {
	let not = notifications[0];
	
	not.measures[0]++;
	not.markers[1] = not.measures[0];
	
	if (not.measures[0] > not.ranges[1]) not.ranges[1] = not.ranges[1] * 2;
	
	redrawSvg("notifications",notifications);
}

function randomize(d){
	return d;
}

 function redrawSvg(id,data) {
	 let svg = d3.select("#"+id).selectAll("svg").data(data);
	 svg.datum(randomize).call(chart.duration(1000));
 }
 
//function createSvg2(data,index, l){
//
//    let svg = d3.select(l).selectAll("svg").data(data).enter().append(
//        "svg").attr("class", "bullet").style("margin-top","30px").attr("width",
//        width + margin.left + margin.right).attr("height",
//        height + margin.top + margin.bottom).append("g").attr("transform",
//        "translate(" + margin.left + "," + margin.top + ")").call(chart);
//
//    let title = svg.append("g").style("text-anchor", "end").attr("transform",
//        "translate(940,27)");
//
//    title.append("text").attr("class", "title").text(function(d) {
//        return d.title;
//    });
//
//    title.append("text").attr("class", "subtitle").attr("dy", "1em").text(
//        function(d) {
//            return d.subtitle;
//        });
//
//	if (index == 0) return;
//	
//	if (placeIds[data[index].place] == undefined) {
//		placeIds[data[index].place] = id();
//	}
//	id_a = placeIds[data[index].place] + i || {} ;
//	id_div = placeIds[data[index].place] + "_div_" + i;
//
//	if(document.getElementById(id_a) === null && document.getElementById(id_div) === null &&  data[index].title !== "Notifications"){
//
//		$(l).append("<div id='"+id_div+"' class='div_button' style='position:relative;height:50px;width: 130px;border: #020202 1px solid; " + "margin-left: 45%;'></div>");
//		$("#"+id_div).append("<a id='"+ id_a +"' data-quantity='"+ data[index].quantity+ "'" + "data-title='"+ data[index].title +"' class='button' href='./indexAnalitics.html' target='_blank' >HISTORY</a>")
//	}
//
//    let buttons = document.getElementsByClassName("button");
//    let buttonsCount = buttons.length;
//    for (let j = 0; j < buttonsCount; j++) {
//        buttons[j].onclick = function() {
//            x = this.dataset.quantity;
//            tit = this.dataset.title;
//        }
//    }
//}