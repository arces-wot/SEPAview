/*
RFC 7946                         GeoJSON                     August 2016

https://tools.ietf.org/html/rfc7946

A.6.  MultiPolygons

   Coordinates of a MultiPolygon are an array of Polygon coordinate
   arrays:

     {
         "type": "MultiPolygon",
         "coordinates": [
             [
                 [
                     [102.0, 2.0],
                     [103.0, 2.0],
                     [103.0, 3.0],
                     [102.0, 3.0],
                     [102.0, 2.0]
                 ]
             ],
             [
                 [
                     [100.0, 0.0],
                     [101.0, 0.0],
                     [101.0, 1.0],
                     [100.0, 1.0],
                     [100.0, 0.0]
                 ],
                 [
                     [100.2, 0.2],
                     [100.2, 0.8],
                     [100.8, 0.8],
                     [100.8, 0.2],
                     [100.2, 0.2]
                 ]
             ]
         ]
     }

  3.3.  FeatureCollection Object

   A GeoJSON object with the type "FeatureCollection" is a
   FeatureCollection object.  A FeatureCollection object has a member
   with the name "features".  The value of "features" is a JSON array.
   Each element of the array is a Feature object as defined above.  It
   is possible for this array to be empty.
   
   	"pilot" : {
		"Ferrari Andrea" : {
		 	"note" : "proprietario e conduttore",
		 	"CODICEUTENTE" : 240871,
		 	"CODICEAPP" : 3097
		},
		"Bertacchini Claudio" :{
			"note" : "proprietario società agricola il girasole conduttore",
			"CODICEUTENTE" : 92320671,
		 	"CODICEAPP" : 27029
		},
		"Bonacini Andrea" :{
			"note" :"proprietario e conduttore",
			"CODICEUTENTE" : 140762,
		 	"CODICEAPP" : 12255
		 }
	},
 * */
function initFields() {
	return queryFields().then((data) => {	
		let n = data.results.bindings.length;
		
		fields = {};
		fields["type"] = "FeatureCollection";
		fields["features"] = [];
		
		for (index = 0; index < n ; index++) {
			
			field = {}
			field["type"] = "Feature";
			field["geometry"] = JSON.parse(data.results.bindings[index].geometry.value);
			field["properties"] = {};
			field["properties"]["field"] = data.results.bindings[index].fieldUri.value;
			field["properties"]["canal"] = data.results.bindings[index].canalUri.value;
			field["properties"]["crop"] = data.results.bindings[index].cropUri.value;
			field["properties"]["cropLabel"] = data.results.bindings[index].cropLabel.value;
			
			if (data.results.bindings[index].fieldUri.value.endsWith("3097")) {
				//field["properties"]["field"]  = "Ferrari Andrea (3097)";
				field["properties"]["color"] = "blue";
			}
			else if (data.results.bindings[index].fieldUri.value.endsWith("27029")) {
				//field["properties"]["field"]  = "Bertacchini Claudio (27029)";
				field["properties"]["color"] = "blue";
			}
			else if (data.results.bindings[index].fieldUri.value.endsWith("12255")) {
				//field["properties"]["field"] = "Bonacini Andrea (12255)";
				field["properties"]["color"] = "blue";
			}
			else {
				field["properties"]["field"] = data.results.bindings[index].fieldUri.value;
				field["properties"]["color"] = "green";
			}
			
			fields["features"].push(field);
		}
		
		return fields;
	});		
}