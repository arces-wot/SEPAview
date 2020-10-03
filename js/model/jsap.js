sepa = undefined;
bench = undefined;
prefixes = undefined;

function initSepa() {
	// PREFIXES	
	prefixes = "";
	for (ns in jsap["namespaces"]) {
		prefixes += " PREFIX " + ns + ":<" + jsap["namespaces"][ns]
			+ ">";
	}

	if (keycloak == undefined)
		sepa = Sepajs.client
	else
		sepa = new Sepajs.client.secure(keycloak, jsap)

	bench = new Sepajs.bench()
}

const jsap = {
	"host": "sepa.vaimee.it",
	"sparql11protocol": {
		"protocol": "https",
		"port": 9001,
		"query": {
			"path": "/secure/query",
			"method": "POST",
			"format": "JSON"
		},
		"update": {
			"path": "/secure/update",
			"method": "POST",
			"format": "JSON"
		}
	},
	"sparql11seprotocol": {
		"protocol": "wss",
		"availableProtocols": {
			"ws": {
				"port": 9002,
				"path": "/subscribe"
			},
			"wss": {
				"port": 9002,
				"path": "/secure/subscribe"
			}
		}
	},
	"namespaces": {
		"rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
		"rdfs": "http://www.w3.org/2000/01/rdf-schema#",
		"sosa": "http://www.w3.org/ns/sosa/",
		"qudt": "http://qudt.org/schema/qudt/",
		"unit": "http://qudt.org/vocab/unit/",
		"monas": "https://vaimee.it/monas#",
		"schema" : "http://schema.org/"
	},
	"updates": {

	},
	"queries": {
		"OBSERVATIONS": {
			"sparql": "SELECT ?prop ?value ?timestamp FROM <http://demo> WHERE {?obs rdf:type sosa:Observation;  sosa:hasFeatureOfInterest ?urn ; sosa:resultTime ?timestamp ; sosa:hasResult ?res ; sosa:observedProperty ?prop . ?res rdf:type qudt:QuantityValue ; qudt:unit unit:DEG_C ; qudt:numericValue ?value}"
		},
		"OBSERVATIONS_COUNT" : {
			"sparql": "SELECT (COUNT(?obs) AS ?count) FROM <http://demo> WHERE {?obs rdf:type sosa:Observation}"
		},
		"FOI_COUNT" : {
			"sparql": "SELECT ?foi (COUNT(DISTINCT ?foi) AS ?count) FROM <http://demo> WHERE {?obs sosa:hasFeatureOfInterest ?foi}"
		}
	}
}