jsap = {
		"host": "mml.arces.unibo.it",
		"oauth": {
			"enable": false,
			"register": "https://localhost:8443/oauth/register",
			"tokenRequest": "https://localhost:8443/oauth/token"
		},
		"sparql11protocol": {
			"protocol": "http",
			"port": 8666,
			"query": {
				"path": "/query",
				"method": "POST",
				"format": "JSON"
			},
			"update": {
				"path": "/update",
				"method": "POST",
				"format": "JSON"
			}
		},
		"sparql11seprotocol": {
			"protocol": "ws",
			"availableProtocols": {
				"ws": {
					"port": 9666,
					"path": "/subscribe"
				},
				"wss": {
					"port": 9443,
					"path": "/secure/subscribe"
				}
			}
		},
		"graphs": {},
		"namespaces": {
			"schema": "http://schema.org/",
			"rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
			"rdfs": "http://www.w3.org/2000/01/rdf-schema#",
			"sosa": "http://www.w3.org/ns/sosa/",
			"qudt": "http://qudt.org/schema/qudt#",
			"unit": "http://qudt.org/vocab/unit#",
			"covid19": "http://covid19#",
			"time": "http://www.w3.org/2006/time#",
			"wgs84_pos": "http://www.w3.org/2003/01/geo/wgs84_pos#",
			"gn": "http://www.geonames.org/ontology#"
		},
		"extended": {},
		"updates": {
		},
		"queries": {
			"PLACES_COUNT": {
				"sparql": "SELECT (COUNT(?place) AS ?count) WHERE {GRAPH <http://covid19/context> {?place rdf:type gn:Feature}}"
			},
			"MAP_PLACES": {
				"sparql": "SELECT * WHERE {GRAPH <http://covid19/context> {?place rdf:type gn:Feature; gn:contryCode ?code ; gn:featureClass ?class ; gn:name ?name ;  gn:lat ?lat ; gn:long ?lon . FILTER NOT EXISTS {?place gn:parentFeature ?parent}}}"
			},
			"CONTAINED_PLACES": {
				"sparql": "SELECT * WHERE {GRAPH <http://covid19/context> {?child gn:parentFeature ?root ; gn:name ?name}}",
				"forcedBindings": {
					"root": {
						"type": "uri",
						"value": "covid19:Place"
					}
				}
			},
			"OBSERVATIONS_COUNT": {
				"sparql": "SELECT (COUNT(?observation) AS ?count) WHERE {GRAPH <http://covid19/observation> {?observation rdf:type sosa:Observation}}"
			},
			"OBSERVATIONS": {
				"sparql": "SELECT * WHERE {GRAPH <http://covid19/observation> {?observation rdf:type sosa:Observation ; sosa:hasFeatureOfInterest ?place ; sosa:resultTime ?timestamp ; sosa:hasResult ?result ; sosa:observedProperty ?property . ?result rdf:type qudt:QuantityValue ; qudt:unit ?unit ; qudt:numericValue ?value . ?property rdfs:label ?label} GRAPH <http://covid19/context> {?place gn:name ?name ;  gn:lat ?lat ; gn:long ?lon} OPTIONAL {?unit qudt:symbol ?symbol}}"
			}
		}
	}