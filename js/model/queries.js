function queryDashboardURL(foi) {
 
	query = bench.sparql(jsap["queries"]["SUPERSET_DASHBOARD_URL"]["sparql"],{
		foi :{
		   type: "uri",
	       value : foi
		}	
	})
	
	return sepa.query(prefixes + " " + query,jsap).then((data)=>{ 
		 for (binding of data.results.bindings) {
    		if (binding.dashboard != undefined) return binding.dashboard.value;
			return undefined;
		}
	 });
}


function queryFoiCount() {
	sepa.query(prefixes + " " + jsap["queries"]["FOI_COUNT"]["sparql"],jsap).then((data)=>{ 
		 for (binding of data.results.bindings) {
    		if (binding.count != undefined) updateFoiCount(binding.count.value);
		}
	 });	
	
}

function queryMapPlaces() {	
	sepa.query(prefixes + " " + jsap["queries"]["MAP_PLACES"]["sparql"],jsap).then((data)=>{ 
		 onAddedMapPlace(data.results.bindings);
	 });	
}

function queryHistory(foi,property,from,to) {
 
	query = bench.sparql(jsap["queries"]["LOG_QUANTITY"]["sparql"],{
		foi :{
		   type: "uri",
	       value : foi
		},
		from : {
			type:"literal",
			value: from
		},
		to : {
			type : "literal",
			value : to
		},
		property :{
		   type: "uri",
	       value : property
		}	
	})
	
	return sepa.query(prefixes + " " + query,jsap).then((data)=>{ 
		 return data;
	 });
}

function queryPlaceTree(placeUri,placeName) {
    tree ={};
    tree["placeUri"] = placeUri;
	tree["placeName"] = placeName;
	tree["childs"] = [];

	console.log("queryPlaceTree "+placeUri+" "+placeName)

	return queryFoi(placeUri,tree["childs"]).then(()=>{
		return tree;
	});
}

function queryFoi(placeUri,tree) {
	console.log("queryFoi "+placeUri)
	
	query = bench.sparql(jsap["queries"]["CONTAINED_FOI"]["sparql"],{
		root :{
		   type: "uri",
	       value : placeUri
		}
	})
	
	return sepa.query(prefixes + " " + query,jsap).then((data)=>{
		let fois = data.results.bindings.length;
		
		for (index = 0; index < fois ; index++) {
			childUri = data.results.bindings[index].foi.value;
			childName = data.results.bindings[index].name.value;
		    
			child ={};
			child["placeUri"] = childUri;
			child["placeName"] = childName;
			child["childs"] = [];
			
			console.log("Push child "+child)
			
			tree.push(child);		
		}
		
		return queryChilds(placeUri,tree);	
	});
}

function queryChilds(placeUri,tree) {
	console.log("queryChilds "+placeUri)
	
    query = bench.sparql(jsap["queries"]["CONTAINED_PLACES"]["sparql"],{
		root :{
		   type: "uri",
	       value : placeUri
		}
	})
    
    return sepa.query(prefixes + " " + query,jsap).then((data)=>{ 
		let places = data.results.bindings.length;
    	
		let promises = [];
		
		for (index = 0; index < places ; index++) {
			childUri = data.results.bindings[index].child.value;
			childName = data.results.bindings[index].name.value;
		    
			child ={};
			child["placeUri"] = childUri;
			child["placeName"] = childName;
			child["childs"] = [];
			
			console.log("Push child "+child)
			
			tree.push(child);
			
			promises.push(queryFoi(childUri,child["childs"]));			
		}
		
		return Promise.all(promises).then(() => {
            return tree;
        })
		
	});
}