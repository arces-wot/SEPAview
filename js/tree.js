/*
<div class="row">
  <div class="col-3">
    <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
      <a class="nav-link active" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home" aria-selected="true">Home</a>
      <a class="nav-link" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="false">Profile</a>
      <a class="nav-link" id="v-pills-messages-tab" data-toggle="pill" href="#v-pills-messages" role="tab" aria-controls="v-pills-messages" aria-selected="false">Messages</a>
      <a class="nav-link" id="v-pills-settings-tab" data-toggle="pill" href="#v-pills-settings" role="tab" aria-controls="v-pills-settings" aria-selected="false">Settings</a>
    </div>
  </div>
  <div class="col-9">
    <div class="tab-content" id="v-pills-tabContent">
      <div class="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">...</div>
      <div class="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">...</div>
      <div class="tab-pane fade" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab">...</div>
      <div class="tab-pane fade" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab">...</div>
    </div>
  </div>
</div>
 * 
 * */

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
						
			$("#v-pills-tab").append("<a class='nav-link ml-"+n*3+"' id='"+id+"-tab' data-toggle='pill' href='#"+id+"' role='tab' aria-controls='"+id+"' aria-selected='false'>"+childName+"</a>");		
			$("#"+id+"-tab").insertAfter("#"+parentId);
//			$("<a class='nav-link ml-"+n*3+" id='"+id+"-tab' data-toggle='pill' href='#"+id+"' role='tab' aria-controls='"+id+"' aria-selected='false'>"+childName+"</a>").insertAfter("#"+parentId);
			
			createNav(childUri,id+"-tab",n+1);
		}
	});
}