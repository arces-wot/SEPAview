var observation = undefined;

function subscribeObservation(foi) {
	query = bench.sparql(jsap["queries"]["OBSERVATIONS_BY_FOI"]["sparql"],{
		foi :{
		   type: "uri",
	       value : foi
		}
	})
	
	if (observation != undefined) observation.kill();
	observation = sepa.subscribe(prefixes +" "+query,jsap);
	observation.on("added",addedResults=>{   		
        for (binding of addedResults.results.bindings) {
        	onObservation(binding,foi);
        }    
    });	
}

function unsubscribeObservation() {
	if (observation != undefined) observation.kill();
}