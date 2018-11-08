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
    		for (index in data.results.bindings) {
    			
    			if (isNaN(index)) continue;
    			
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
             $(rootDiv).append("<ul id='" + id_ul + "'></ul>");
             $("#" + id_ul).append("<li id='" + id_li + "' style='margin-left:"+ n*15 +"px;'></li>");
             $("#" + id_li).append(childPlaceName);


             // Add listener
             document.querySelector('#' + id_li).addEventListener("click", onClick(childPlaceUri, "#" + id_ul, n ), false);
             
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
    
    
    
//    // QUERY for observations of root
//    query = prefixes + " " + jsap["queries"]["OBSERVATIONS_BY_LOCATION"]["sparql"];
//    query.replace("?location","<"+place+">");
//    
//    sepa.query(query,{host:jsap["host"]}).then((data)=>{
//    		if (data.results.bindings.length > 0) {
//    			// Create place UUID
//    			if (placeIds[place] == undefined) {
//    				placeIds[place] = id();	
//    			}
//    		
//    			$("#"+placeIds[place]).show();
//    		}
//    });
}

//	const Jsap = Sepajs.Jsap
//	
//	app = new Jsap(jsap);
//	app.CONTAINED_PLACES({"root" : root},data => {
//		msg = JSON.parse(data);
//
//        child = [""];
//        namesCh = [""];
//        namesRo = [""];
//        
//        if (msg["notification"] !== undefined) {
//
//            len = msg["notification"]["addedResults"]["results"]["bindings"].length - 1;
//            for (index = 0; index <= len; index++) {
//
//                binding = msg.notification.addedResults.results.bindings[index];
//
//                c = binding.child.value;
//                nCh = binding.nameCh.value;
//                nRo = binding.nameRo.value;
//                child.push(c);
//                namesCh.push(nCh);
//                namesRo.push(nRo);
//            }
//
//             if(child.length === 1){
//            	    id_place = encodeURIComponent(root).split("%").join("_").split(".").join("-"); 
//                $("#"+id_place).show();
//            }else{
//                 openNav();
//
//                for (i = 1; i < child.length; i++) {
//                    id_li = encodeURIComponent(child[i]).split("%").join("_").split(".").join("-"); //child[i].slice(34, child[i].length) + "_li";
//                    id_ul = id_li + "_ul";
//
//                    $(r).append("<ul id='" + id_ul + "'></ul>");
//                    $("#"+id_ul).append("<li id='" + id_li + "'></li>");
//                    $("#" + id_li).append(namesCh[i]);
//
//                    document.querySelector('#' + id_li).addEventListener("click", doSomething(id_ul, jsap, id_li), false);
//                    // funzione wrapper
//                    function doSomething(id_u, js, id_l) {
//                        return function (e) {
//                            e.stopPropagation();
//                            createTree(id_l.slice(0,id_l.length - 3), js, "#" + id_l);
//                        }
//                    }
//                }
//            }
//        }
//	});
	
	
//    const sepa = Sepajs.client;
//	
//	// PREFIXES
//    prefixes = "";
//    for (ns in jsapObj["namespaces"]) {
//        prefixes += "PREFIX " + ns + ":<"+ jsapObj["namespaces"][ns] + ">";
//    }
//    
//	// ------------------------------------------------------------------------------------
//    // MAP_PLACES
//    // ------------------------------------------------------------------------------------
//    query = prefixes + " " + jsapObj["queries"]["CONTAINED_PLACES"]["sparql"];
//
//    sepa.subscribe(query,{
//            next(val) {
//                console.log("Data received: " + val);
//                msg = JSON.parse(val);
//
//                child = [""];
//                namesCh = [""];
//                namesRo = [""];
//                if (msg["notification"] !== undefined) {
//
//                    len = msg["notification"]["addedResults"]["results"]["bindings"].length - 1;
//                    for (index = 0; index <= len; index++) {
//
//                        binding = msg.notification.addedResults.results.bindings[index];
//
//                        c = binding.child.value;
//                        nCh = binding.nameCh.value;
//                        nRo = binding.nameRo.value;
//                        child.push(c);
//                        namesCh.push(nCh);
//                        namesRo.push(nRo);
//                    }
//
//                     if(child.length === 1){
//                        $("#"+root).show();
//                    }else{
//                         openNav();
//
//                        for (i = 1; i < child.length; i++) {
//                            id_li = child[i].slice(34, child[i].length) + "_li";
//                            id_ul = id_li + "_ul";
//
//                            $(r).append("<ul id='" + id_ul + "'></ul>");
//                            $("#"+id_ul).append("<li id='" + id_li + "'></li>");
//                            $("#" + id_li).append(namesCh[i]);
//
//                            document.querySelector('#' + id_li).addEventListener("click", doSomething(id_ul, jsap, id_li), false);
//                            //funzione wrapper
//                            function doSomething(id_u, js, id_l) {
//                                return function (e) {
//                                    e.stopPropagation();
//                                    createTree(id_l.slice(0,id_l.length - 3), js, "#" + id_l);
//                                }
//                            }
//                        }
//                    }
//                } else { console.log(msg); }},
//            error(err) { console.log("Received an error: " + err) },
//            complete() { console.log("Server closed connection ") }, },
//
//        {host:jsapObj["host"]});
//}