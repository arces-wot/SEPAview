function createTree(place, rootDiv,n){
    if(sensorData[place] !== undefined) {
        $("#"+sensorData[place]["div_id"]).show();
    }

	// QUERY for contained places
	const sepa = Sepajs.client;
	
	// PREFIXES
    prefixes = "";
    for (ns in jsap["namespaces"]) {
        prefixes += " PREFIX " + ns + ":<"+ jsap["namespaces"][ns] + ">";
    }

    query = prefixes + " " + jsap["queries"]["CONTAINED_PLACES"]["sparql"];
    query = query.replace("?root","<"+place+">");
    
    sepa.query(query,{host:jsap["host"]}).then((data)=>{ 
    		let places = data.results.bindings.length;

    		for (index = 0; index < places ; index++) {
    			//if (isNaN(index)) continue;

    			childPlaceUri = data.results.bindings[index].child.value;
    			childPlaceName = data.results.bindings[index].childName.value;

			// Create place UUID if it do not exist
			if (placeIds[childPlaceUri] === undefined) {
				placeIds[childPlaceUri] = generateID();
			}

			// Using UUID as id
			id_li = placeIds[childPlaceUri] + "_li";
            id_ul = placeIds[childPlaceUri] + "_ul";

            // Create <ul>
            // TODO : APPENDI SONO SE NON CI SONO GIA' FIGLI
            if (document.querySelector('#' + id_li) == undefined) {
            		$(rootDiv).append("<ul id='" + id_ul + "'></ul>");
            		$("#" + id_ul).append("<li id='" + id_li + "' style='margin-left:"+ n*15 +"px;'></li>");
            		$("#" + id_li).append(childPlaceName);

            		// Add listener
            		document.querySelector('#' + id_li).addEventListener("click", onClick(childPlaceUri, "#" + id_ul, n ), false);
            }
             
             // On tree element click
             function onClick(p, r, counter) {
            	 	return function (e) {
            	 		e.stopPropagation();
            	 		counter = counter + 1;
            	 		createTree(p,r,counter);
                 }
            }
    		}

    		openNav();

    	});
}