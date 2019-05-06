function createObservationsNav(placeUri,placeName,div) {
	// Create place UUID if it do not exist
	if (placeIds[placeUri] === undefined) {
		placeIds[placeUri] = generateID();
	}
	id = placeIds[placeUri];
	
	//$(div).append("<div class='container' id='"+id+"'></div>");
	
	$(div).append("<div class='container' id='"+id+"'></div>");
	
	createNav(placeUri,placeName,id,0);
}

function createNav(placeUri,placeName,id, n) {
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
			childName = data.results.bindings[index].childName.value;
		    // Create place UUID if it do not exist
			if (placeIds[childUri] === undefined) {
				placeIds[childUri] = generateID();
			}
			childDiv = placeIds[childUri];
			
//			$("#"+id).append("<div class='row mt-1 ml-'"+n*3+"><a class='btn btn-primary' data-toggle='collapse' href='#"+childDiv+"' role='button' aria-expanded='true' aria-controls='"+childDiv+"'>"+childName+"</a></div>");
//			$("#"+id).append("<div class='container' id='"+childDiv+"'></div>");
			
			$("#"+id).append("<div class='row mt-1 ml-'"+n*3+"><a class='btn btn-primary' data-toggle='collapse' href='#"+childDiv+"' role='button' aria-expanded='true' aria-controls='"+childDiv+"'>"+childName+"</a></div>");
			$("#"+id).append("<div class='container' id='"+childDiv+"'></div>");			
			
			createNav(childUri,childName,childDiv,n+1);
		}
	});
}