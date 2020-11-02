
placeNames = {};

function placeParentsNames(uri) {
	return placeNames[uri];
}

function createObservationsTree(tree, day) {
	// Create place UUID if it do not exist
	if (placeIds[tree["placeUri"]] === undefined) {
		placeIds[tree["placeUri"]] = generateID();
	}
	id = placeIds[tree["placeUri"]];

	if ($("#" + id).length == 0) {
		// Live observations
		$("#graph").append("<div class='tab-pane fade' id='" + id + "' role='tabpanel' aria-labelledby='" + id + "-tab'></div>");
	}

	$('#tree').empty();
	$("#tree").append("<div class='nav flex-column nav-pills' id='v-pills-tab' role='tablist' aria-orientation='vertical'/>");
	$("#v-pills-tab").append("<a class='nav-link' id='" + id + "-tab' data-toggle='pill' href='#" + id + "' role='tab' aria-controls='" + id + "' aria-selected='false'>" + tree["placeName"] + "</a>");

	$('#' + id + '-tab').on('shown.bs.tab', function(e) {
		elem = $('#live_' + e.target.id.split('-')[0]);
		console.log("shown " + elem.length)
		if (elem.length > 0) {
			console.log("show analytics "+tree["placeUri"])
			showAnalytics(tree["placeUri"])
		}
	});

	$('#' + id + '-tab').on('hidden.bs.tab', function(e) {
		elem = $('#live_' + e.target.id.split('-')[0]);
		console.log("hidden " + elem.length)
		if (elem.length > 0) {
			console.log("hide analytics "+tree["placeUri"])
			showAnalytics(tree["placeUri"])
		}
	});


	$("#" + id + "-tab").tab('show');

	placeNames = {};
	placeNames[tree["placeUri"]] = [];
	placeNames[tree["placeUri"]].push(tree["placeName"]);

	$("input[placeId='" + id + "']").val(escape(tree["placeName"]))

	createTree(tree["childs"], id + "-tab", 1, placeNames[tree["placeUri"]], day);
}

function createTree(childs, parentId, n, names, day) {
	for (child of childs) {
		if (placeIds[child["placeUri"]] === undefined) {
			placeIds[child["placeUri"]] = generateID();
		}
		id = placeIds[child["placeUri"]];

		childName = child["placeName"];
		for (i = 0; i < n; i++) { childName = "&nbsp&nbsp&nbsp&nbsp" + childName };

		$("#v-pills-tab").append("<a class='nav-link' id='" + id + "-tab' data-toggle='pill' href='#" + id + "' role='tab' aria-controls='" + id + "' aria-selected='false'>" + childName + "</a>");
		$("#" + id + "-tab").insertAfter("#" + parentId);

		$('#' + id + '-tab').on('shown.bs.tab', function(e) {
			elem = $('#live_' + e.target.id.split('-')[0]);
			console.log("shown " + elem.length)
			if (elem.length > 0) {
				console.log("show analytics "+child["placeUri"])
				showAnalytics(child["placeUri"])
			}
		});

		$('#' + id + '-tab').on('hidden.bs.tab', function(e) {
			elem = $('#live_' + e.target.id.split('-')[0]);
			console.log("hidden " + elem.length)
			if (elem.length > 0) {
				console.log("hide analytics "+child["placeUri"])
				hideAnalytics(child["placeUri"])
			}
		});

		placeNames[child["placeUri"]] = [];
		for (x of names) placeNames[child["placeUri"]].push(x);
		placeNames[child["placeUri"]].push(child["placeName"]);

		name = "";
		for (x of placeNames[child["placeUri"]]) {
			if (name == "") name = x;
			else name = name + " - " + x;
		}
		$("input[placeId='" + id + "']").val(escape(name));

		createTree(child["childs"], id + "-tab", n + 1, placeNames[child["placeUri"]]);
	}
}