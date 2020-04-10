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
			"PLACES": {
				"sparql": "SELECT * WHERE {GRAPH <http://covid19/context> {?place rdf:type gn:Feature; gn:countryCode ?code ; gn:featureClass ?class ; gn:name ?name ;  gn:lat ?lat ; gn:long ?lon . OPTIONAL {?place gn:parentFeature ?parent}}}"
			},
			"HISTORY":{
				"sparql": "SELECT * WHERE {  GRAPH <http://covid19/observation/history> {    ?a rdf:type sosa:Observation;    	sosa:resultTime ?timestamp;        sosa:observedProperty ?property;       	sosa:hasFeatureOfInterest ?place;       	sosa:hasResult ?res.    ?res rdf:type ?type;         qudt:unit ?unit;         qudt:numericValue ?value.              }FILTER (xsd:dateTime(?timestamp) > ?from && xsd:dateTime(?timestamp) < ?to)} ORDER BY ?timestamp",
				"forcedBindings": {
					"from": {
						"type": "literal",
						"value": "2020-03-22T17:00:00Z"
					},
					"to": {
						"type": "literal",
						"value": "2020-03-22T17:00:00Z"
					},
					"place": {
						"type": "uri",
						"value": "covid19:Place"
					},
					"property": {
						"type": "uri",
						"value": "covid19:Property"
					}
				}
			},
			"MAP_PLACES": {
				"sparql": "SELECT  * FROM <http://covid19/context> FROM <http://covid19/observation> WHERE {?place rdf:type gn:Feature; gn:countryCode ?code ; gn:featureClass ?class ; gn:name ?name ;  gn:lat ?lat ; gn:long ?lon . FILTER NOT EXISTS {?place gn:featureCode gn:A.ADM2} . ?obs rdf:type sosa:Observation ; sosa:hasFeatureOfInterest ?place ; sosa:observedProperty <http://covid19#TotalCases>; sosa:hasResult  ?res . ?res qudt:numericValue ?cases}"
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
			"OBSERVATIONS": {
				"sparql": "SELECT * FROM ?qudtGraph FROM ?obsGraph FROM ?ctxGraph FROM ?proGraph WHERE {?observation rdf:type sosa:Observation ; sosa:hasFeatureOfInterest ?place ; sosa:resultTime ?timestamp ; sosa:hasResult ?result ; sosa:observedProperty ?property . ?result rdf:type qudt:QuantityValue ; qudt:unit ?unit ; qudt:numericValue ?value . ?property rdfs:label ?label . ?place gn:name ?name ;  gn:lat ?lat ; gn:long ?lon . OPTIONAL {?unit qudt:symbol ?symbol}}",
				"forcedBindings": {
					"qudtGraph": {
						"type": "uri",
						"value": "http://localhost:8890/DAV"
					},
					"obsGraph": {
						"type": "uri",
						"value": "http://covid19/observation"
					},
					"proGraph": {
						"type": "uri",
						"value": "http://covid19/observation/context"
					},
					"ctxGraph": {
						"type": "uri",
						"value": "http://covid19/context"
					}
				}
			},
			"OBSERVATIONS_COUNT": {
				"sparql": "SELECT (COUNT(?observation) AS ?count) WHERE {GRAPH <http://covid19/observation> {?observation rdf:type sosa:Observation}}"
			}
		}
	}