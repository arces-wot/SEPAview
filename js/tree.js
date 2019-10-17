// DEPRECATED - this file mixes UI and data loding, to retrive a tree
// of Observations and Places use tree2.js. Then render it within your 
// UI logic.
function createObservationsNav(placeUri,placeName) {
	// Create place UUID if it do not exist
	if (placeIds[placeUri] === undefined) {
		placeIds[placeUri] = generateID();
	}
	id = placeIds[placeUri];
	
	
	if($("#" + id).length == 0) {
		$("#graph").append("<div class='tab-pane fade' id='"+id+"' role='tabpanel' aria-labelledby='"+id+"-tab'></div>");
	}
	
	$('#tree').empty();
	$("#tree").append("<div class='nav flex-column nav-pills' id='v-pills-tab' role='tablist' aria-orientation='vertical'/>");
	$("#v-pills-tab").append("<a class='nav-link' id='"+id+"-tab' data-toggle='pill' href='#"+id+"' role='tab' aria-controls='"+id+"' aria-selected='false'>"+placeName+"</a>");
	$("#"+id+"-tab").tab('show');
	
	createNav(placeUri,id+"-tab",0);
}

function createNav(placeUri, parentId,n) {
	// QUERY for contained places
	const sepa = Sepajs.client;
    prefixes = "";
    for (ns in jsap["namespaces"]) {
        prefixes += " PREFIX " + ns + ":<"+ jsap["namespaces"][ns] + ">";
    }
    query = prefixes + " " + jsap["queries"]["CONTAINED_PLACES"]["sparql"];
	query = query.replace("?root","<"+placeUri+">");
	
	
    sepa.query(query,jsap).then((data)=>{ 
		let places = data.results.bindings.length;
    		
		for (index = 0; index < places ; index++) {
			childUri = data.results.bindings[index].child.value;
			childName = data.results.bindings[index].name.value;
		    
			// Create place UUID if it do not exist
			if (placeIds[childUri] === undefined) {
				placeIds[childUri] = generateID();
			}
			id = placeIds[childUri];
			link = 'www.google.it';
						
			$("#v-pills-tab").append("<a class='nav-link ml-"+n*3+"' id='"+id+"-tab' data-toggle='pill' href='#"+link+"' role='tab' aria-controls='"+id+"' aria-selected='false'>"+childName+"</a>");		
			$("#"+id+"-tab").insertAfter("#"+parentId);
			
			createNav(childUri,id+"-tab",n+1); 
		}
		
	});
}