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
		"schema": "http://schema.org/"
	},
	"updates": {

	},
	"queries": {
		"OBSERVATIONS": {
			"sparql": "SELECT * FROM <http://demo/observations> FROM <http://demo/devices> FROM <http://demo/places> FROM <http://demo/properties> FROM <http://qudt.org/2.1> WHERE {?obs rdf:type sosa:Observation; sosa:madeBySensor ?urn ; sosa:hasFeatureOfInterest ?foi ; sosa:resultTime ?timestamp ; sosa:hasSimpleResult ?value . ?foi schema:location ?location . ?location  schema:GeoCoordinates ?coordinate . ?coordinate schema:latitude ?lat ; schema:longitude ?long . ?urn sosa:observes ?prop . ?prop rdfs:label ?label . ?location schema:name ?name . ?prop qudt:applicableUnit ?unit . ?unit rdfs:label ?symbol}"
		},
		"OBSERVATIONS_COUNT": {
			"sparql": "SELECT (COUNT(?obs) AS ?count) FROM <http://demo/observations> WHERE {?obs rdf:type sosa:Observation}"
		},
		"FOI_COUNT": {
			"sparql": "SELECT (COUNT(DISTINCT ?foi) AS ?count) FROM <http://demo/devices> WHERE {?foi rdf:type sosa:FeatureOfInterest}"
		},
		"MAP_PLACES": {
			"sparql": "SELECT * FROM <http://demo/places> WHERE {?root rdf:type schema:Place; schema:name ?name ;  schema:GeoCoordinates ?coordinate . ?coordinate schema:latitude ?lat ; schema:longitude ?long.  FILTER NOT EXISTS{?root schema:containedInPlace ?place}}"
		},
		"CONTAINED_PLACES": {
			"sparql": "SELECT * FROM <http://demo/places> WHERE {?root schema:containsPlace ?child . ?child schema:name ?name}",
			"forcedBindings": {
				"root": {
					"type": "uri",
					"value": "monas:Vaimee"
				}
			}
		},
		"CONTAINED_FOI": {
			"sparql": "SELECT * FROM <http://demo/devices> WHERE {?foi schema:location ?root ; rdfs:label ?name}",
			"forcedBindings": {
				"root": {
					"type": "uri",
					"value": "monas:Vaimee"
				}
			}
		},
		"LOG_QUANTITY": {
			"sparql": "SELECT * FROM <http://demo/history> FROM <http://demo/devices> WHERE {?urn sosa:madeObservation ?obs . ?urn sosa:observes ?property . ?obs sosa:hasFeatureOfInterest ?foi ; sosa:resultTime ?timestamp ; sosa:hasSimpleResult ?value FILTER (?timestamp > STRDT(?from, xsd:dateTimeStamp) && ?timestamp < STRDT(?to,xsd:dateTimeStamp))} ORDER BY ?timestamp",
			"forcedBindings": {
				"from": {
					"datatype": "xsd:dateTimeStamp",
					"type": "literal",
					"value": "2020-10-15T00:00:00Z"
				},
				"to": {
					"datatype": "xsd:dateTimeStamp",
					"type": "literal",
					"value": "2020-10-15T23:59:59Z"
				},
				"foi": {
					"type": "uri",
					"value": "urn:epc:id:gid:13101974.0.0"
				},
				"property": {
					"type": "uri",
					"value": "monas:ProbeATemperature"
				}
			}
		}
	}
}

jsap_swamp = {
	"host": "engine",
	"oauth": {
		"enable": false,
		"register": "https://localhost:8443/oauth/register",
		"tokenRequest": "https://localhost:8443/oauth/token"
	},
	"sparql11protocol": {
		"protocol": "http",
		"port": 8000,
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
				"port": 9000,
				"path": "/subscribe"
			},
			"wss": {
				"port": 9443,
				"path": "/secure/subscribe"
			}
		}
	},
	"graphs": {

	},
	"namespaces": {
		"schema": "http://schema.org/",
		"rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
		"rdfs": "http://www.w3.org/2000/01/rdf-schema#",
		"sosa": "http://www.w3.org/ns/sosa/",
		"qudt": "http://qudt.org/schema/qudt#",
		"unit": "http://qudt.org/vocab/unit#",
		"arces-monitor": "http://wot.arces.unibo.it/monitor#",
		"swamp": "http://swamp-project.org/ns#",
		"mqtt": "http://wot.arces.unibo.it/mqtt#",
		"time": "http://www.w3.org/2006/time#",
		"wgs84_pos": "http://www.w3.org/2003/01/geo/wgs84_pos#",
		"gn": "http://www.geonames.org/ontology#",
		"swamp2": "http://swamp-project.org/ontology/swamp#",
		"agrovoc": "http://aims.fao.org/aos/agrovoc/",
		"xsd": "http://www.w3.org/2001/XMLSchema#"
	},
	"extended": {

	},
	"updates": {

	},
	"queries": {
		"CROP": {
			"sparql": "SELECT * FROM <http://swamp-project.org/cbec/crop> WHERE {?crop rdf:type swamp2:Crop ; rdf:type agrovoc:c_8171 ; swamp2:hasCropCode ?code ; rdfs:label ?label} ORDER BY ?label"
		},
		"FIELD": {
			"sparql": "SELECT * FROM <http://swamp-project.org/cbec/field> FROM <http://swamp-project.org/cbec/crop> WHERE {?fieldUri rdf:type <http://swamp-project.org/ontology/swamp#Field> ; <http://swamp-project.org/ontology/swamp#hasGeometry> ?geometry ; <http://swamp-project.org/ontology/swamp#hasCanal> ?canalUri ; <http://swamp-project.org/ontology/swamp#hasCrop> ?cropUri ; <http://swamp-project.org/ontology/swamp#managedBy> ?farmerUri . ?cropUri rdfs:label ?cropLabel}"
		},
		"FORECAST_N_DAYS": {
			"sparql": "SELECT * WHERE {OPTIONAL {?unit qudt:symbol ?symbol} graph <http://wot.arces.unibo.it/forecast> {?obs sosa:hasFeatureOfInterest ?place ; rdf:type swamp:Forecast ; sosa:resultTime ?resultTime ; sosa:phenomenonTime ?timestamp ; sosa:observedProperty ?property ; sosa:hasResult ?res . ?res qudt:numericValue ?value ; qudt:unit ?unit BIND((xsd:dateTime(substr(xsd:string(?timestamp),1,10)) - xsd:dateTime(substr(xsd:string(?resultTime),1,10)))/86400 AS ?diff) FILTER (xsd:dateTime(?resultTime) >= xsd:dateTime(concat(?from,'T00:00:00Z')) && xsd:dateTime(?resultTime) <= xsd:dateTime(concat(?to,'T23:59:59Z')) && (?diff = xsd:integer(?n)) )}} ORDER BY xsd:dateTime(?timestamp)",
			"forcedBindings": {
				"from": {
					"type": "literal",
					"value": "2019-07-30"
				},
				"to": {
					"type": "literal",
					"value": "2019-08-03"
				},
				"n": {
					"type": "literal",
					"value": "0"
				},
				"place": {
					"type": "uri",
					"value": "swamp:Bertacchini"
				},
				"property": {
					"type": "uri",
					"value": "swamp:LeafAreaIndex"
				}
			}
		},
		"FORECAST_IRRIGATION": {
			"sparql": "SELECT ?value ?symbol WHERE {graph <http://wot.arces.unibo.it/forecast> {?obs sosa:hasFeatureOfInterest ?place ; rdf:type swamp:Forecast; sosa:resultTime ?resultTime ; sosa:phenomenonTime ?prediction ; sosa:observedProperty swamp:IrrigationNeeds ; sosa:hasResult ?res . ?res qudt:numericValue ?value ; qudt:unit ?unit} . OPTIONAL {?unit qudt:symbol ?symbol} FILTER (xsd:dateTime(?resultTime) = xsd:dateTime(concat(?from ,'T00:00:00Z')) && xsd:dateTime(?prediction) = xsd:dateTime(concat(?to ,'T00:00:00Z')))}",
			"forcedBindings": {
				"from": {
					"type": "literal",
					"value": "2019-09-01"
				},
				"to": {
					"type": "literal",
					"value": "2019-09-01"
				},
				"place": {
					"type": "uri",
					"value": "swamp:Bertacchini"
				}
			}
		},
		"FORECAST_LAI": {
			"sparql": "SELECT ?value ?symbol WHERE {graph <http://wot.arces.unibo.it/forecast> {?obs sosa:hasFeatureOfInterest ?place ; rdf:type swamp:Forecast; sosa:resultTime ?resultTime ; sosa:phenomenonTime ?prediction ; sosa:observedProperty swamp:LeafAreaIndex ; sosa:hasResult ?res . ?res qudt:numericValue ?value ; qudt:unit ?unit} . OPTIONAL{?unit qudt:symbol ?symbol} FILTER (xsd:dateTime(?resultTime) = xsd:dateTime(concat(?from ,'T00:00:00Z')) && xsd:dateTime(?prediction) = xsd:dateTime(concat(?to ,'T00:00:00Z')))}",
			"forcedBindings": {
				"from": {
					"type": "literal",
					"value": "2019-09-01"
				},
				"to": {
					"type": "literal",
					"value": "2019-09-01"
				},
				"place": {
					"type": "uri",
					"value": "swamp:Bertacchini"
				}
			}
		},
		"FORECAST_WEATHER_TEMPERATURE": {
			"sparql": "SELECT ?symbol (MAX(?value) AS ?max) (MIN(?value) AS ?min) (AVG(?value) AS ?avg) WHERE {graph <http://wot.arces.unibo.it/forecast> {?obs sosa:hasFeatureOfInterest ?place ; rdf:type swamp:Forecast ; sosa:resultTime ?resultTime ; sosa:phenomenonTime ?prediction ; sosa:observedProperty arces-monitor:AirTemperature ; sosa:hasResult ?res . ?res qudt:numericValue ?value ; qudt:unit ?unit } . OPTIONAL {?unit qudt:symbol ?symbol } FILTER (xsd:dateTime(?resultTime) > xsd:dateTime(concat(?from ,'T00:00:00Z')) && xsd:dateTime(?resultTime) < xsd:dateTime(concat(?from ,'T23:59:59Z')) && xsd:dateTime(?prediction) > xsd:dateTime(concat(?to ,'T00:00:00Z')) && xsd:dateTime(?prediction) < xsd:dateTime(concat(?to ,'T23:59:59Z')))} GROUP BY ?symbol",
			"forcedBindings": {
				"from": {
					"type": "literal",
					"value": "2019-09-01"
				},
				"to": {
					"type": "literal",
					"value": "2019-09-01"
				},
				"place": {
					"type": "uri",
					"value": "swamp:Bertacchini"
				}
			}
		},
		"FORECAST_WEATHER_PRECIPITATION": {
			"sparql": "SELECT ?symbol (SUM(?value) AS ?sum) WHERE {graph <http://wot.arces.unibo.it/forecast> {?obs sosa:hasFeatureOfInterest ?place ; rdf:type swamp:Forecast ; sosa:resultTime ?resultTime ; sosa:phenomenonTime ?prediction ; sosa:observedProperty arces-monitor:Precipitation ; sosa:hasResult ?res . ?res qudt:numericValue ?value ; qudt:unit ?unit } . OPTIONAL {?unit qudt:symbol ?symbol}  FILTER (xsd:dateTime(?resultTime) > xsd:dateTime(concat(?from ,'T00:00:00Z')) && xsd:dateTime(?resultTime) < xsd:dateTime(concat(?from ,'T23:59:59Z')) && xsd:dateTime(?prediction) > xsd:dateTime(concat(?to ,'T00:00:00Z')) && xsd:dateTime(?prediction) < xsd:dateTime(concat(?to ,'T23:59:59Z')))} GROUP BY ?symbol",
			"forcedBindings": {
				"from": {
					"type": "literal",
					"value": "2019-09-01"
				},
				"to": {
					"type": "literal",
					"value": "2019-09-01"
				},
				"place": {
					"type": "uri",
					"value": "swamp:Bertacchini"
				}
			}
		},
		"MQTT_MAPPINGS": {
			"sparql": "SELECT * {GRAPH <http://wot.arces.unibo.it/mqtt> {?mapping rdf:type mqtt:Mapping ; mqtt:observation ?observation ; mqtt:topic ?topic}}"
		},
		"MQTT_MAPPER": {
			"sparql": "SELECT DISTINCT ?regex ?topic {GRAPH <http://wot.arces.unibo.it/mqtt> {?mapper rdf:type mqtt:Mapper ; mqtt:regex ?regex ; mqtt:topic ?topic}}",
			"forcedBindings": {
				"mapper": {
					"type": "uri",
					"value": "mqtt:JsonMapper"
				}
			}
		},
		"MQTT_MAPPERS_TOPICS": {
			"sparql": "SELECT DISTINCT ?topic {GRAPH <http://wot.arces.unibo.it/mqtt> {?mapper rdf:type mqtt:Mapper ; mqtt:regex ?regex ; mqtt:topic ?topic}}"
		},
		"MQTT_BROKERS": {
			"sparql": "SELECT * WHERE { GRAPH <http://wot.arces.unibo.it/mqtt> {?broker mqtt:url ?url ; rdf:type mqtt:Broker ; mqtt:port ?port ; mqtt:ssl ?ssl . OPTIONAL {?broker mqtt:user ?user ; mqtt:password ?password}}}"
		},
		"MQTT_BROKER_TOPICS": {
			"sparql": "SELECT ?topic WHERE { GRAPH <http://wot.arces.unibo.it/mqtt> {?broker mqtt:url ?url ; rdf:type mqtt:Broker ; mqtt:port ?port ; mqtt:topic ?topic}}",
			"forcedBindings": {
				"url": {
					"type": "literal",
					"value": "giove.arces.unibo.it"
				},
				"port": {
					"type": "literal",
					"value": 52877,
					"datatype": "xsd:integer"
				}
			}
		},
		"LOG_QUANTITY": {
			"sparql": "SELECT * WHERE {GRAPH <http://wot.arces.unibo.it/observation/history> {?result sosa:isResultOf ?observation ; qudt:numericValue ?value; time:inXSDDateTimeStamp ?timestamp} FILTER (xsd:dateTime(?timestamp) > xsd:dateTime(?from) && xsd:dateTime(?timestamp) < xsd:dateTime(?to))} ORDER BY xsd:dateTime(?timestamp)",
			"forcedBindings": {
				"from": {
					"datatype": "xsd:dateTime",
					"type": "literal",
					"value": "2019-07-15T00:00:00Z"
				},
				"to": {
					"datatype": "xsd:dateTime",
					"type": "literal",
					"value": "2019-07-15T23:59:59Z"
				},
				"observation": {
					"type": "uri",
					"value": "arces-monitor:SanMicheleLevelsL1"
				}
			}
		},
		"PLACES": {
			"sparql": "SELECT * WHERE {GRAPH <http://wot.arces.unibo.it/context> {?place rdf:type schema:Place; schema:name ?name ;  schema:GeoCoordinates ?coordinate . ?coordinate schema:latitude ?lat ; schema:longitude ?long}}"
		},
		"NO_CHILD": {
			"sparql": "SELECT * WHERE {GRAPH <http://wot.arces.unibo.it/context> {?root rdf:type schema:Place ; schema:name ?name . FILTER NOT EXISTS{?child schema:containedInPlace ?root}}}"
		},
		"MAP_PLACES": {
			"sparql": "SELECT * WHERE {GRAPH <http://wot.arces.unibo.it/context> {?root rdf:type schema:Place; schema:name ?name ;  schema:GeoCoordinates ?coordinate . ?coordinate schema:latitude ?lat ; schema:longitude ?long.  FILTER NOT EXISTS{?root schema:containedInPlace ?place}}}"
		},
		"MAP_GROUPS": {
			"sparql": "SELECT * WHERE {GRAPH <http://wot.arces.unibo.it/context> {?root rdf:type schema:Place; rdf:type ?group ; schema:name ?name ;  schema:GeoCoordinates ?coordinate . ?coordinate schema:latitude ?lat ; schema:longitude ?long . ?group rdfs:label ?label   FILTER NOT EXISTS{?root schema:containedInPlace ?place}}}"
		},
		"CONTAINED_PLACES": {
			"sparql": "SELECT * WHERE {GRAPH <http://wot.arces.unibo.it/context> {?root schema:containsPlace ?child . ?child schema:name ?name}}",
			"forcedBindings": {
				"root": {
					"type": "uri",
					"value": "arces-monitor:Mars"
				}
			}
		},
		"ROOT_PLACES": {
			"sparql": "SELECT * WHERE {GRAPH <http://wot.arces.unibo.it/context> {?root rdf:type schema:Place . ?root schema:name ?name .  FILTER NOT EXISTS{?root schema:containedInPlace ?place} }}"
		},
		"OBSERVATIONS": {
			"sparql": "SELECT * FROM <http://wot.arces.unibo.it/unit> FROM <http://swamp-project.org/observation/cbec> FROM <http://wot.arces.unibo.it/observation> FROM <http://wot.arces.unibo.it/context> WHERE {?observation rdf:type sosa:Observation ; rdfs:label ?label ; sosa:hasResult ?quantity ; sosa:hasFeatureOfInterest ?location . ?location rdf:type schema:Place ; schema:name ?name ; schema:GeoCoordinates ?coordinate . ?coordinate schema:latitude ?lat ; schema:longitude ?long . ?quantity rdf:type qudt:QuantityValue ; qudt:unit ?unit . OPTIONAL {?quantity qudt:numericValue ?value} . OPTIONAL {?observation sosa:resultTime ?timestamp} . ?location schema:name ?name . OPTIONAL{?unit qudt:symbol ?symbol}}"
		},
		"OBSERVATIONS_OLD": {
			"sparql": "SELECT * WHERE {?unit qudt:symbol ?symbol . GRAPH <http://wot.arces.unibo.it/context> {?location rdf:type schema:Place ; schema:name ?name ; schema:GeoCoordinates ?coordinate . ?coordinate schema:latitude ?lat ; schema:longitude ?long}.GRAPH <http://wot.arces.unibo.it/observation> {?observation rdf:type sosa:Observation ; rdfs:label ?label ; sosa:hasResult ?quantity ; sosa:hasFeatureOfInterest ?location . ?quantity rdf:type qudt:QuantityValue ; qudt:unit ?unit . OPTIONAL {?quantity qudt:numericValue ?value} . OPTIONAL {?observation sosa:resultTime ?timestamp}}}"
		},
		"OBSERVATIONS_BY_LOCATION": {
			"sparql": "SELECT * FROM <http://swamp-project.org/observation/cbec> FROM <http://wot.arces.unibo.it/observation> WHERE {?observation sosa:hasFeatureOfInterest ?location ; rdf:type sosa:Observation ; rdfs:label ?label ; sosa:hasResult ?quantity . ?quantity rdf:type qudt:QuantityValue ; qudt:unit ?unit . OPTIONAL {?quantity qudt:numericValue ?value} . OPTIONAL {?observation sosa:resultTime ?timestamp}}",
			"forcedBindings": {
				"location": {
					"type": "uri",
					"value": "arces-monitor:Mars"
				}
			}
		},
		"OBSERVATIONS_BY_UNIT": {
			"sparql": "SELECT * FROM <http://swamp-project.org/observation/cbec> FROM <http://wot.arces.unibo.it/observation> WHERE {?observation rdf:type sosa:Observation ; rdfs:label ?label ; sosa:hasFeatureOfInterest ?location ; sosa:hasResult ?quantity . ?quantity rdf:type qudt:QuantityValue ; qudt:unit ?unit . OPTIONAL {?quantity qudt:numericValue ?value} . OPTIONAL {?observation sosa:resultTime ?timestamp}}",
			"forcedBindings": {
				"unit": {
					"type": "uri",
					"value": "unit:DegreeCelsius"
				}
			}
		},
		"ALL_VALUES": {
			"sparql": "SELECT * FROM <http://swamp-project.org/observation/cbec> FROM <http://wot.arces.unibo.it/observation> WHERE {?observation rdf:type sosa:Observation ; rdfs:label ?label ; sosa:hasFeatureOfInterest ?location ; sosa:hasResult ?quantity . ?quantity rdf:type qudt:QuantityValue ; qudt:unit ?unit OPTIONAL {?quantity qudt:numericValue ?value} . OPTIONAL {?observation sosa:resultTime ?timestamp}}",
			"forcedBindings": {
				"observation": {
					"type": "uri",
					"value": "arces-monitor:ObservationXYZ"
				}
			}
		},
		"MQTT_TOPICS_COUNT": {
			"sparql": "SELECT (COUNT(DISTINCT ?topic) AS ?topics) WHERE {GRAPH <http://wot.arces.unibo.it/mqtt/message> {?message rdf:type mqtt:Message ; mqtt:topic ?topic}}"
		},
		"MQTT_TOPICS": {
			"sparql": "SELECT DISTINCT * WHERE {GRAPH <http://wot.arces.unibo.it/mqtt/message> {?message rdf:type mqtt:Message ; mqtt:topic ?topic ; mqtt:hasBroker ?broker}}"
		},
		"MQTT_TOPIC_VALUE": {
			"sparql": "SELECT * WHERE {GRAPH <http://wot.arces.unibo.it/mqtt/message> {?message rdf:type mqtt:Message ; mqtt:topic ?topic; mqtt:value ?value}}",
			"forcedBindings": {
				"topic": {
					"type": "literal",
					"value": "mqttTopicXYZ"
				}
			}
		},
		"MQTT_MESSAGES": {
			"sparql": "SELECT * WHERE {GRAPH <http://wot.arces.unibo.it/mqtt/message> {?message rdf:type mqtt:Message ; mqtt:value ?value ; mqtt:topic ?topic ; mqtt:hasBroker ?broker;  time:inXSDDateTimeStamp ?timestamp}}"
		},
		"HISTORICAL_TRIPLES": {
			"sparql": "SELECT (COUNT(?log) AS ?count) WHERE {GRAPH <http://wot.arces.unibo.it/observation/history> {?log ?x ?y}}"
		},
		"LIVE_TRIPLES": {
			"sparql": "SELECT (COUNT(?log) AS ?count) FROM <http://swamp-project.org/observation/cbec> FROM <http://wot.arces.unibo.it/observation> WHERE {?log ?x ?y}"
		},
		"PLACES_COUNT": {
			"sparql": "SELECT (COUNT(?place) AS ?count) WHERE {GRAPH <http://wot.arces.unibo.it/context> {?place rdf:type schema:Place}}"
		},
		"OBSERVATIONS_COUNT": {
			"sparql": "SELECT (COUNT(?observation) AS ?count) FROM <http://swamp-project.org/observation/cbec> FROM <http://wot.arces.unibo.it/observation> FROM <http://wot.arces.unibo.it/context> WHERE {?location rdf:type schema:Place . ?observation sosa:hasFeatureOfInterest ?location ; rdf:type sosa:Observation}"
		},
		"FORECASTS_COUNT": {
			"sparql": "SELECT (COUNT(?forecast) AS ?count) WHERE {GRAPH <http://wot.arces.unibo.it/forecast> {?forecast rdf:type swamp:Forecast}}"
		},
		"IRRIGATION_REQUESTS_BY_FIELD": {
			"sparql": "SELECT * FROM <http://swamp-project.org/cbec/irrigation> WHERE {?irr rdf:type swamp2:IrrigationRequest ; time:inXSDDateTimeStamp ?timestamp ; swamp2:issuedBy ?issuedBy ; swamp2:hasCurrentStatus ?currentStatus ; swamp2:requestNumber ?requestNumber ; swamp2:reservationNumber ?reservationNumber ; swamp2:hasField ?fieldUri ; swamp2:hasStatus ?status . ?status time:inXSDDateTimeStamp ?x ; swamp2:requestStatus ?reqStatus} ORDER BY ?timestamp",
			"forcedBindings": {
				"fieldUri": {
					"type": "uri",
					"value": "http://swamp-project.org/cbec/field_23566"
				}
			}
		},
		"IRRIGATION_REQUESTS_COUNT": {
			"sparql": "SELECT (COUNT(?irr) AS ?n) FROM <http://swamp-project.org/cbec/irrigation> WHERE {?irr rdf:type swamp2:IrrigationRequest}"
		}
	}
}