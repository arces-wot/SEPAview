jsap = {
		"host": "localhost",
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
		"graphs": {},
		"namespaces": {
			"schema": "http://schema.org/",
			"rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
			"rdfs": "http://www.w3.org/2000/01/rdf-schema#",
			"sosa": "http://www.w3.org/ns/sosa/",
			"qudt" : "http://qudt.org/schema/qudt#",
			"unit" : "http://qudt.org/vocab/unit#",
			"arces-monitor": "http://wot.arces.unibo.it/monitor#",
			"swamp" : "http://swamp-project.org/ns#",
			"mqtt": "http://wot.arces.unibo.it/mqtt#",
			"time": "http://www.w3.org/2006/time#",
			"wgs84_pos": "http://www.w3.org/2003/01/geo/wgs84_pos#",
			"gn": "http://www.geonames.org/ontology#"
		},
		"extended": {},
		"updates": {
			"ADD_MQTT_MAPPING" : {
				"sparql" : "WITH <http://wot.arces.unibo.it/mqtt> DELETE {?mapping ?p ?o} INSERT {_:mapping rdf:type mqtt:Mapping ; mqtt:observation ?observation ; mqtt:topic ?topic} WHERE {OPTIONAL{?mapping rdf:type mqtt:Mapping ; mqtt:observation ?observation ; ?p ?o}}",
				"forcedBindings": {
					"topic": {
						"type": "literal",
						"value": "5CCF7F1B599E/temperature"
					},
					"observation": {
						"type": "uri",
						"value": "arces-monitor:5CCF7F1B599E-temperature"
					}
				}
			},
			"ADD_MQTT_MAPPER" : {
				"sparql" : "INSERT DATA {GRAPH <http://wot.arces.unibo.it/mqtt> {?mapper rdf:type mqtt:Mapper ; mqtt:regex ?regex ; mqtt:topic ?topic}}",
				"forcedBindings": {
					"regex": {
						"type": "literal",
						"value": "S[|]\\w+[|]I[|]\\w+[|](?<id1>\\w+)[|](?<value1>\\w+)[|](?<id2>\\w+)[|](?<value2>\\w+)[|](?<id3>\\w+)[|](?<value3>\\w+)"
					},
					"topic": {
						"type": "literal",
						"value": "application/1/device/754366e02ff23515/rx"
					},
					"mapper": {
						"type": "uri",
						"value": "mqtt:JsonMapper"
					}
				}
			},
			"REMOVE_MQTT_MAPPER" : {
				"sparql" : "WITH <http://wot.arces.unibo.it/mqtt> DELETE {?mapper ?p ?o} WHERE {?mapper rdf:type mqtt:Mapper ; ?p ?o} ",
				"forcedBindings": {
					"pattern": {
						"type": "uri",
						"value": "mqtt:JsonMapper"
					}
				}
			},
			"ADD_REGEX_TO_MQTT_MAPPER" : {
				"sparql" : "WITH <http://wot.arces.unibo.it/mqtt> INSERT {?mapper mqtt:regex ?regex} WHERE {?mapper rdf:type mqtt:Mapper}",
				"forcedBindings": {
					"regex": {
						"type": "literal",
						"value": "S[|]\\w+[|]I[|]\\w+[|](?<id1>\\w+)[|](?<value1>\\w+)[|](?<id2>\\w+)[|](?<value2>\\w+)"
					},
					"mapper": {
						"type": "uri",
						"value": "mqtt:JsonMapper"
					}
				}
			},
			"ADD_TOPIC_TO_MQTT_MAPPER" : {
				"sparql" : "WITH <http://wot.arces.unibo.it/mqtt> INSERT {?mapper mqtt:topic ?topic} WHERE {?mapper rdf:type mqtt:Mapper}",
				"forcedBindings": {
					"topic": {
						"type": "literal",
						"value": "application/1/device/1bc0f73caf72d467/rx"
					},
					"mapper": {
						"type": "uri",
						"value": "mqtt:JsonMapper"
					}
				}
			},
			"ADD_MQTT_BROKER" : {
				"sparql" : "WITH <http://wot.arces.unibo.it/mqtt> DELETE {?broker rdf:type mqtt:Broker ;  mqtt:url ?url ; mqtt:port ?port ; mqtt:ssl ?ssl1} INSERT {_:broker mqtt:url ?url ; rdf:type mqtt:Broker ; mqtt:port ?port ; mqtt:ssl ?ssl} WHERE {OPTIONAL {?broker rdf:type mqtt:Broker ;  mqtt:url ?url ; mqtt:port ?port ; mqtt:ssl ?ssl1} }",
				"forcedBindings": {
					"url": {
						"type": "literal",
						"value": "giove.arces.unibo.it"
					},
					"port": {
						"type": "literal",
						"value": 52877,
						"datatype": "xsd:integer"
					},
					"ssl" : {
						"type" : "literal",
						"value" : false,
						"datatype" : "xsd:boolean"
					}
				}
			},
			"ADD_MQTT_BROKER_WITH_AUTH" : {
				"sparql" : "WITH <http://wot.arces.unibo.it/mqtt> DELETE {?broker rdf:type mqtt:Broker ;  mqtt:url ?url ; mqtt:port ?port ; mqtt:ssl ?ssl1 ; mqtt:user ?user1 ; mqtt:password ?password1} INSERT {_:broker mqtt:url ?url ; rdf:type mqtt:Broker ; mqtt:port ?port ; mqtt:ssl ?ssl ; mqtt:user ?user ; mqtt:password ?password} WHERE {OPTIONAL {?broker rdf:type mqtt:Broker ;  mqtt:url ?url ; mqtt:port ?port ; mqtt:ssl ?ssl1 ; mqtt:user ?user1 ; mqtt:password ?password1} }",
				"forcedBindings": {
					"url": {
						"type": "literal",
						"value": "roger.wizzilab.com"
					},
					"port": {
						"type": "literal",
						"value": 8883,
						"datatype": "xsd:integer"
					},
					"ssl" : {
						"type" : "literal",
						"value" : false,
						"datatype" : "xsd:boolean"
					},
					"user" : {
						"type": "literal",
						"value": "ffa574972ab9"
					},
					"password" : {
						"type": "literal",
						"value": "6e257b56172ea934d79ee1f5c2c1c7a9"
					}
				}
			},
			"ADD_TOPIC_TO_MQTT_BROKER" : {
				"sparql" : "WITH <http://wot.arces.unibo.it/mqtt> INSERT {?broker mqtt:topic ?topic} WHERE {?broker rdf:type mqtt:Broker ; mqtt:url ?url ; mqtt:port ?port}",
				"forcedBindings": {
					"url": {
						"type": "literal",
						"value": "giove.arces.unibo.it"
					},
					"port": {
						"type": "literal",
						"value": 52877,
						"datatype": "xsd:integer"
					},
					"topic" : {
						"type" : "literal",
						"value" : "#"
					}
				}
			},
			"REMOVE_MQTT_BROKER" : {
				"sparql" : "WITH <http://wot.arces.unibo.it/mqtt> DELETE {?broker ?s ?p} WHERE {?broker rdf:type mqtt:Broker ; mqtt:url ?url ; mqtt:port ?port ; ?s ?p }",
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
			"CLEAR_MQTT_GRAPH": {
				"sparql": "WITH <http://wot.arces.unibo.it/mqtt> DELETE {?s ?p ?o} WHERE {?s ?p ?o}"
			},
			"CLEAR_HISTORY_GRAPH": {
				"sparql": "WITH <http://wot.arces.unibo.it/observation/history> DELETE {?s ?p ?o} WHERE {?s ?p ?o}"
			},
			"CLEAR_MQTT_MESSAGE_GRAPH": {
				"sparql": "WITH <http://wot.arces.unibo.it/mqtt/message> DELETE {?s ?p ?o} WHERE {?s ?p ?o}"
			},
			"CLEAR_CONTEXT_GRAPH": {
				"sparql": "WITH <http://wot.arces.unibo.it/context> DELETE {?s ?p ?o} WHERE {?s ?p ?o}"
			},
			"CLEAR_OBSERVATION_GRAPH": {
				"sparql": "WITH <http://wot.arces.unibo.it/observation> DELETE {?s ?p ?o} WHERE {?s ?p ?o}"
			},
			"REMOVE_PLACE": {
				"sparql": "WITH <http://wot.arces.unibo.it/context> DELETE {?place rdf:type schema:Place; schema:name ?name ;  schema:GeoCoordinates ?coordinate . ?coordinate schema:latitude ?lat ; schema:longitude ?lon} WHERE {?place rdf:type schema:Place; schema:name ?name ;  schema:GeoCoordinates ?coordinate . ?coordinate schema:latitude ?lat ; schema:longitude ?lon}",
				"forcedBindings": {
					"place": {
						"type": "uri",
						"value": "arces-monitor:Mars"
					}
				}
			},
			"ADD_PLACE": {
				"sparql": "INSERT {GRAPH <http://wot.arces.unibo.it/context> {?place rdf:type schema:Place; schema:name ?name ;  schema:GeoCoordinates _:coordinate . _:coordinate schema:latitude ?lat ; schema:longitude ?lon}} WHERE {}",
				"forcedBindings": {
					"place": {
						"type": "uri",
						"value": "arces-monitor:Mars"
					},
					"name": {
						"type": "literal",
						"value": "Mars"
					},
					"lat": {
						"type": "literal",
						"value": "44.489664",
						"datatype": "xsd:decimal"
					},
					"lon": {
						"type": "literal",
						"value": "11.357023",
						"datatype": "xsd:decimal"
					}
				}
			},
			"LINK_PLACES": {
				"sparql": "INSERT DATA { GRAPH <http://wot.arces.unibo.it/context> {?root schema:containsPlace ?child . ?child schema:containedInPlace ?root }}",
				"forcedBindings": {
					"root": {
						"type": "uri",
						"value": "arces-monitor:rootPlace"
					},
					"child": {
						"type": "uri",
						"value": "arces-monitor:childPlace"
					}
				}
			},
			"DELETE_LINK_PLACES": {
				"sparql": "DELETE DATA { GRAPH <http://wot.arces.unibo.it/context> {?root schema:containsPlace ?child . ?child schema:containedInPlace ?root }}",
				"forcedBindings": {
					"root": {
						"type": "uri",
						"value": "arces-monitor:rootPlace"
					},
					"child": {
						"type": "uri",
						"value": "arces-monitor:childPlace"
					}
				}
			},
			"MQTT_MESSAGE": {
				"sparql": "WITH <http://wot.arces.unibo.it/mqtt/message> DELETE {?oldMessage rdf:type mqtt:Message ; mqtt:value ?oldValue ; mqtt:topic ?topic ; mqtt:hasBroker ?broker ; time:inXSDDateTimeStamp ?oldTimestamp} INSERT {_:message rdf:type mqtt:Message ; mqtt:value ?value ; mqtt:topic ?topic ; mqtt:hasBroker ?broker ; time:inXSDDateTimeStamp ?timestamp} WHERE {OPTIONAL{?oldMessage rdf:type mqtt:Message ; mqtt:value ?oldValue ; mqtt:topic ?topic ; mqtt:hasBroker ?broker ; time:inXSDDateTimeStamp ?oldTimestamp} . BIND(now() AS ?timestamp)}",
				"forcedBindings": {
					"value": {
						"type": "literal",
						"value": "mqttValueXYZ"
					},
					"topic": {
						"type": "literal",
						"value": "mqttTopicXYZ"
					},
					"broker": {
						"type": "literal",
						"value": "tcp://giove.arces.unibo.it:52887"
					}
				}
			},
			"LOG_QUANTITY": {
				"sparql": "INSERT {GRAPH <http://wot.arces.unibo.it/observation/history> {_:result sosa:isResultOf ?observation ; qudt:numericValue ?value ; time:inXSDDateTimeStamp ?timestamp}} WHERE {BIND(now() AS ?timestamp)}",
				"forcedBindings": {
					"observation": {
						"type": "uri",
						"value": "arces-monitor:ObservationXYZ"
					},
					"value": {
						"type": "literal",
						"value": "1234",
						"datatype": "xsd:decimal"
					}
				}
			},
			"REMOVE_OBSERVATION": {
				"sparql": "WITH <http://wot.arces.unibo.it/observation> DELETE {?observation rdf:type sosa:Observation ; rdfs:label ?label ; rdfs:comment ?comment ; sosa:hasFeatureOfInterest ?location ; arces-monitor:hasMqttTopic ?topic ; sosa:hasResult ?quantity . ?quantity rdf:type qudt:QuantityValue ; qudt:unit ?unit ; qudt:numericValue ?value} WHERE {?observation rdf:type sosa:Observation ; rdfs:label ?label ; rdfs:comment ?comment ; sosa:hasFeatureOfInterest ?location ; mqtt:topic ?topic ; sosa:hasResult ?quantity . ?quantity rdf:type qudt:QuantityValue ; qudt:unit ?unit ; qudt:numericValue ?value}",
				"forcedBindings": {
					"observation": {
						"type": "uri",
						"value": "arces-monitor:ObservationXYZ"
					}
				}
			},
			"ADD_OBSERVATION": {
				"sparql": "INSERT {GRAPH <http://wot.arces.unibo.it/observation> {?observation rdf:type sosa:Observation ; rdfs:label ?label ; rdfs:comment ?comment ; sosa:hasFeatureOfInterest ?location ; sosa:hasResult _:quantity . _:quantity rdf:type qudt:QuantityValue ; qudt:unit ?unit ; qudt:numericValue 'NaN'}} WHERE {}",
				"forcedBindings": {
					"observation": {
						"type": "uri",
						"value": "arces-monitor:ObservationXYZ"
					},
					"comment": {
						"type": "literal",
						"value": "This is an observation"
					},
					"label": {
						"type": "literal",
						"value": "The observation XYZ"
					},
					"location": {
						"type": "uri",
						"value": "arces-monitor:Mars"
					},
					"unit": {
						"type": "uri",
						"value": "unit:DegreeCelsius"
					}
				}
			},
			"UPDATE_OBSERVATION_VALUE": {
				"sparql": "WITH <http://wot.arces.unibo.it/observation> DELETE { ?quantity qudt:numericValue ?oldValue . ?observation sosa:resultTime ?oldTime } INSERT { ?quantity qudt:numericValue ?value . ?observation sosa:resultTime ?now } WHERE { ?observation rdf:type sosa:Observation ; sosa:hasResult ?quantity . OPTIONAL { ?observation sosa:resultTime ?oldTime} . OPTIONAL {?quantity qudt:numericValue ?oldValue } BIND(now() AS ?now) }",
				"forcedBindings": {
					"observation": {
						"type": "uri",
						"value": "arces-monitor:ObservationXYZ"
					},
					"value": {
						"type": "literal",
						"datatype": "xsd:decimal",
						"value": "12345.67890"
					}
				}
			}
		},
		"queries": {
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
				"sparql": "SELECT (MAX(?value) AS ?max) (MIN(?value) AS ?min) (AVG(?value) AS ?avg) ?symbol WHERE {graph <http://wot.arces.unibo.it/forecast> {?obs sosa:hasFeatureOfInterest ?place ; rdf:type swamp:Forecast ; sosa:resultTime ?resultTime ; sosa:phenomenonTime ?prediction ; sosa:observedProperty arces-monitor:AirTemperature ; sosa:hasResult ?res . ?res qudt:numericValue ?value ; qudt:unit ?unit } . OPTIONAL {?unit qudt:symbol ?symbol } FILTER (xsd:dateTime(?resultTime) > xsd:dateTime(concat(?from ,'T00:00:00Z')) && xsd:dateTime(?resultTime) < xsd:dateTime(concat(?from ,'T23:59:59Z')) && xsd:dateTime(?prediction) > xsd:dateTime(concat(?to ,'T00:00:00Z')) && xsd:dateTime(?prediction) < xsd:dateTime(concat(?to ,'T23:59:59Z')))}",
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
				"sparql": "SELECT (SUM(?value) AS ?sum) ?symbol WHERE {graph <http://wot.arces.unibo.it/forecast> {?obs sosa:hasFeatureOfInterest ?place ; rdf:type swamp:Forecast ; sosa:resultTime ?resultTime ; sosa:phenomenonTime ?prediction ; sosa:observedProperty arces-monitor:Precipitation ; sosa:hasResult ?res . ?res qudt:numericValue ?value ; qudt:unit ?unit } . OPTIONAL {?unit qudt:symbol ?symbol}  FILTER (xsd:dateTime(?resultTime) > xsd:dateTime(concat(?from ,'T00:00:00Z')) && xsd:dateTime(?resultTime) < xsd:dateTime(concat(?from ,'T23:59:59Z')) && xsd:dateTime(?prediction) > xsd:dateTime(concat(?to ,'T00:00:00Z')) && xsd:dateTime(?prediction) < xsd:dateTime(concat(?to ,'T23:59:59Z')))}",
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
			"MQTT_MAPPINGS" : {
				"sparql" : "SELECT * {GRAPH <http://wot.arces.unibo.it/mqtt> {?mapping rdf:type mqtt:Mapping ; mqtt:observation ?observation ; mqtt:topic ?topic}}"
			},
			"MQTT_MAPPER" : {
				"sparql" : "SELECT DISTINCT ?regex ?topic {GRAPH <http://wot.arces.unibo.it/mqtt> {?mapper rdf:type mqtt:Mapper ; mqtt:regex ?regex ; mqtt:topic ?topic}}",
				"forcedBindings": {
					"mapper": {
						"type": "uri",
						"value": "mqtt:JsonMapper"
					}
				}
			},
			"MQTT_MAPPERS_TOPICS" : {
				"sparql" : "SELECT DISTINCT ?topic {GRAPH <http://wot.arces.unibo.it/mqtt> {?mapper rdf:type mqtt:Mapper ; mqtt:regex ?regex ; mqtt:topic ?topic}}"
			},
			"MQTT_BROKERS" : {
				"sparql" : "SELECT * WHERE { GRAPH <http://wot.arces.unibo.it/mqtt> {?broker mqtt:url ?url ; rdf:type mqtt:Broker ; mqtt:port ?port ; mqtt:ssl ?ssl . OPTIONAL {?broker mqtt:user ?user ; mqtt:password ?password}}}"
			},
			"MQTT_BROKER_TOPICS" : {
				"sparql" : "SELECT ?topic WHERE { GRAPH <http://wot.arces.unibo.it/mqtt> {?broker mqtt:url ?url ; rdf:type mqtt:Broker ; mqtt:port ?port ; mqtt:topic ?topic}}",
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
				"sparql": "SELECT * WHERE {GRAPH <http://wot.arces.unibo.it/observation/history> {?result sosa:isResultOf ?observation ; qudt:numericValue ?value; time:inXSDDateTimeStamp ?timestamp} FILTER (xsd:dateTime(?timestamp) > xsd:dateTime(?from) && xsd:dateTime(?timestamp) < xsd:dateTime(?to))} ORDER BY ?timestamp",
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
				"sparql": "SELECT * WHERE {?unit qudt:symbol ?symbol . GRAPH <http://wot.arces.unibo.it/observation> {?observation rdf:type sosa:Observation ; rdfs:label ?label ; sosa:hasResult ?quantity ; sosa:hasFeatureOfInterest ?location . ?quantity rdf:type qudt:QuantityValue ; qudt:unit ?unit . OPTIONAL {?quantity qudt:numericValue ?value} . OPTIONAL {?observation sosa:resultTime ?timestamp}} . GRAPH <http://wot.arces.unibo.it/context> {?location schema:name ?name} }"
			},
			"OBSERVATIONS_BY_LOCATION": {
				"sparql": "SELECT * WHERE {GRAPH <http://wot.arces.unibo.it/observation> {?observation sosa:hasFeatureOfInterest ?location ; rdf:type sosa:Observation ; rdfs:label ?label ; sosa:hasResult ?quantity . ?quantity rdf:type qudt:QuantityValue ; qudt:unit ?unit . OPTIONAL {?quantity qudt:numericValue ?value} . OPTIONAL {?observation sosa:resultTime ?timestamp}}}",
				"forcedBindings": {
					"location": {
						"type": "uri",
						"value": "arces-monitor:Mars"
					}
				}
			},
			"OBSERVATIONS_BY_UNIT": {
				"sparql": "SELECT * WHERE {GRAPH <http://wot.arces.unibo.it/observation> {?observation rdf:type sosa:Observation ; rdfs:label ?label ; sosa:hasFeatureOfInterest ?location ; sosa:hasResult ?quantity . ?quantity rdf:type qudt:QuantityValue ; qudt:unit ?unit . OPTIONAL {?quantity qudt:numericValue ?value} . OPTIONAL {?observation sosa:resultTime ?timestamp}}}",
				"forcedBindings": {
					"unit": {
						"type": "uri",
						"value": "unit:DegreeCelsius"
					}
				}
			},
			"ALL_VALUES": {
				"sparql": "SELECT * WHERE {GRAPH <http://wot.arces.unibo.it/observation> {?observation rdf:type sosa:Observation ; rdfs:label ?label ; sosa:hasFeatureOfInterest ?location ; sosa:hasResult ?quantity . ?quantity rdf:type qudt:QuantityValue ; qudt:unit ?unit OPTIONAL {?quantity qudt:numericValue ?value} . OPTIONAL {?observation sosa:resultTime ?timestamp}}}",
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
				"sparql": "SELECT (COUNT(?log) AS ?count) WHERE {GRAPH <http://wot.arces.unibo.it/observation> {?log ?x ?y}}"
			},
			"PLACES_COUNT": {
				"sparql": "SELECT (COUNT(?place) AS ?count) WHERE {GRAPH <http://wot.arces.unibo.it/context> {?place rdf:type schema:Place}}"
			},
			"OBSERVATIONS_COUNT": {
				"sparql": "SELECT (COUNT(?observation) AS ?count) WHERE {GRAPH <http://wot.arces.unibo.it/observation> {?observation rdf:type sosa:Observation}}"
			}
		}
	}