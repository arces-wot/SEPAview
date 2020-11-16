var placeIds = {};

var placeUris = {};

function addPlace(place_id) {

	var container = document.createElement("div");
	container.setAttribute("class", "container flex");
	container.setAttribute("id", "live_" + place_id);

	var tab_pane = document.createElement("div");
	tab_pane.setAttribute("class", "tab-pane fade");
	tab_pane.setAttribute("id", place_id);
	tab_pane.setAttribute("role", "tabpanel");
	tab_pane.setAttribute("aria-labelledby", place_id + "-tab");
	tab_pane.appendChild(container);

	document.getElementById("graph").appendChild(tab_pane);
}

function createObservationsTree(tree) {
	$('#graph').empty();
	$('#tree').empty();
	$("#tree").append("<div class='nav flex-column nav-pills' id='v-pills-tab' role='tablist' aria-orientation='vertical'/>");
	
	place_uri = tree["placeUri"];
	
	// Create place UUID if it do not exist
	if (placeIds[place_uri] === undefined) {
		placeIds[place_uri] = generateID();
	}

	id = placeIds[place_uri];
	placeUris[id] = place_uri;

	if (sensorData[place_uri] === undefined) {
		sensorData[place_uri] = {};

		sensorData[place_uri]["div_id"] = id;

		addPlace(id);
	}
	
	
	$("#v-pills-tab").append("<a class='nav-link' id='" + id + "-tab' data-toggle='pill' href='#" + id + "' role='tab' aria-controls='" + id + "' aria-selected='false'>" + tree["placeName"] + "</a>");

	//$("#" + id + "-tab").tab('show');

	//	if ($("#" + id).length == 0) {
	//		// Live observations
	//		$("#graph").append("<div class='tab-pane fade' id='" + id + "' role='tabpanel' aria-labelledby='" + id + "-tab'>"+id+"</div>");
	//	}


	$('#' + id + '-tab').on('shown.bs.tab', function(e) {
		console.log("show " + placeUris[e.target.id.split('-')[0]]);
		subscribeObservation(placeUris[e.target.id.split('-')[0]]);
		showAnalytics(placeUris[e.target.id.split('-')[0]]);
		//		elem = $('#live_' + e.target.id.split('-')[0]);
		//		console.log("shown " + elem.length)
		//		if (elem.length > 0) {
		//			console.log("show analytics " + tree["placeUri"])
		//			showAnalytics(tree["placeUri"])
		//			
		//		}
	});

	$('#' + id + '-tab').on('hidden.bs.tab', function(e) {
		hideAnalytics(placeUris[e.target.id.split('-')[0]])
		//		unsubscribeObservation();

		//		elem = $('#live_' + e.target.id.split('-')[0]);
		//		console.log("hidden " + elem.length)
		//		if (elem.length > 0) {
		//			console.log("hide analytics " + tree["placeUri"])
		//			hideAnalytics(tree["placeUri"]);
		//			
		//		}
	});

	createTree(tree["childs"], id + "-tab", 1);
}

function createTree(childs, parentId, n) {
	for (child of childs) {
		place_uri = child["placeUri"];

		if (placeIds[place_uri] === undefined) {
			placeIds[place_uri] = generateID();
		}

		id = placeIds[place_uri];
		placeUris[id] = place_uri;

		if (sensorData[place_uri] === undefined) {
			sensorData[place_uri] = {};

			sensorData[place_uri]["div_id"] = id;

			addPlace(id);
		}

		childName = child["placeName"];
		for (i = 0; i < n; i++) { childName = "&nbsp&nbsp&nbsp&nbsp" + childName };

		$("#v-pills-tab").append("<a class='nav-link' id='" + id + "-tab' data-toggle='pill' href='#" + id + "' role='tab' aria-controls='" + id + "' aria-selected='false'>" + childName + "</a>");
		$("#" + id + "-tab").insertAfter("#" + parentId);

		$('#' + id + '-tab').on('shown.bs.tab', function(e) {
			console.log("show " + placeUris[e.target.id.split('-')[0]]);
			subscribeObservation(placeUris[e.target.id.split('-')[0]]);
			showAnalytics(placeUris[e.target.id.split('-')[0]]);
			//			elem = $('#live_' + e.target.id.split('-')[0]);
			//			console.log("shown " + elem.length)
			//			if (elem.length > 0) {
			//				console.log("show analytics " + child["placeUri"])
			//				showAnalytics(child["placeUri"])
			//			}
		});

		$('#' + id + '-tab').on('hidden.bs.tab', function(e) {
			hideAnalytics(placeUris[e.target.id.split('-')[0]]);
			//			unsubscribeObservation();

			//			elem = $('#live_' + e.target.id.split('-')[0]);
			//			console.log("hidden " + elem.length)
			//			if (elem.length > 0) {
			//				console.log("hide analytics " + child["placeUri"])
			//				hideAnalytics(child["placeUri"])
			//			}
		});

		createTree(child["childs"], id + "-tab", n + 1);
	}
}