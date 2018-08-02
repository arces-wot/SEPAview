function subscribe(jsapObj,id) {
    // SPARQL
    //jsapObj = JSON.parse(jsap);

    //------------------------------------------------------------------------------------
    //PLACES
    //------------------------------------------------------------------------------------

    subscribe = jsapObj["queries"][id[0]]["sparql"];

    // PREFIXES
    prefixes = "";
    for (ns in jsapObj["namespaces"]) {
        prefixes += "PREFIX " + ns + ":<"+ jsapObj["namespaces"][ns] + ">";
    }

    query = prefixes + " " + subscribe;

    const sepa = Sepajs.client;

    sepa.subscribe(query,{
            next(val) {
                console.log("Data received: " + val);
                msg = JSON.parse(val);

                n = [];
                latitude = [];
                longitude = [];
                p = [];


                if (msg["notification"] !== undefined) {

                    len = msg["notification"]["addedResults"]["results"]["bindings"].length - 1;
                    //for (index in msg["notification"]["addedResults"]["results"]["bindings"]) {
                    for (index = 0; index <= len; index++) {

                        binding = msg.notification.addedResults.results.bindings[index];

                        places = binding.place.value;
                        names = binding.name.value;
                        lat = parseFloat(binding.lat.value);
                        lng = parseFloat(binding.long.value);

                        latitude.push(lat);
                        longitude.push(lng);
                        n.push(names);
                        p.push(places);

                    }

                    initMap(latitude,longitude);
                    add_marker(latitude,longitude,n);




                } else { console.log(msg); }},
            error(err) { console.log("Received an error: " + err) },
            complete() { console.log("Server closed connection ") }, },

        {host:jsapObj["host"]})


    //------------------------------------------------------------------------------------
    //OBSERVATIONS
    //------------------------------------------------------------------------------------

    queryObj = jsap["queries"][id[1]];

    // SPARQL
    sparql = queryObj["sparql"];

    // HOST
    if (queryObj["host"] != undefined)
        host = queryObj["host"];
    else
        host = jsap["host"];

    // PROTOCOL
    if (queryObj["sparql11seprotocol"] != undefined) {
        if (queryObj["sparql11seprotocol"]["protocol"] != undefined)
            scheme = queryObj["protocol"];
        else
            scheme = jsap["sparql11seprotocol"]["protocol"];

        if (queryObj["sparql11seprotocol"]["availableProtocols"] != undefined)
            if (queryObj["sparql11seprotocol"]["availableProtocols"][scheme] != undefined)
                if (queryObj["sparql11seprotocol"]["availableProtocols"][scheme]["port"] != undefined)
                    port = queryObj["sparql11seprotocol"]["availableProtocols"][scheme]["port"];

        if (queryObj["sparql11seprotocol"]["availableProtocols"] != undefined)
            if (queryObj["sparql11seprotocol"]["availableProtocols"][scheme] != undefined)
                if (queryObj["sparql11seprotocol"]["availableProtocols"][scheme]["path"] != undefined)
                    port = queryObj["sparql11seprotocol"]["availableProtocols"][scheme]["path"];
    }
    else {
        scheme = jsap["sparql11seprotocol"]["protocol"];
        port = jsap["sparql11seprotocol"]["availableProtocols"][scheme]["port"];
        path = jsap["sparql11seprotocol"]["availableProtocols"][scheme]["path"];
    }

    // URL
    subscribeURI = scheme + "://" + host + ":" + port + path;

    // GRAPHS
    if (jsap["graphs"] != undefined) {
        default_graph_uri = jsap["graphs"]["default-graph-uri"];
        named_graph_uri = jsap["graphs"]["named-graph-uri"];
    }
    else {
        default_graph_uri = "http://default";
        named_graph_uri = "http://default";
    }

    if (queryObj["graphs"] != undefined) {
        if (queryObj["graphs"]["default-graph-uri"] != undefined) default_graph_uri = queryObj["graphs"]["default-graph-uri"];
        if (queryObj["graphs"]["named-graph-uri"] != undefined) named_graph_uri = queryObj["graphs"]["named-graph-uri"];
    }

    // PREFIXES
    prefixes = "";
    for (ns in jsap["namespaces"]) {
        prefixes += "PREFIX " + ns + ":<" + jsap["namespaces"][ns] + ">";
    }

    // SUBSCRIBE
    subscribeRequest = JSON.stringify({
        "subscribe" : {
            "sparql" : prefixes + " " + sparql,
            "default-graph-uri" : default_graph_uri,
            "named-graph-uri" : named_graph_uri
        }
    });

    // OPEN
    var ws = new WebSocket(subscribeURI);

    ws.onerror = function() {
        console.log("ERROR");
        subid = null;
    };

    // SUBSCRIBE
    ws.onopen = function() {
        ws.send(subscribeRequest);
    };

    // HANDLER
    ws.onmessage = function(event) {

        // parse the message
        msg = JSON.parse(event.data);

        if (msg["notification"] !== undefined) {
            for (index in msg["notification"]["addedResults"]["results"]["bindings"]) {

                binding = msg.notification.addedResults.results.bindings[index];
                if (binding.observation != null && binding.value != null) {
                    uri = binding.observation.value;
                    locations = binding.location.value;
                    value = binding.value.value;
                    unit = binding.unit.value;
                    label = binding.label.value;

                    loc = locations.substr(33,locations.length-1);


                    updateData(uri, value, label, unit, loc);
                }

            }
        } else {
            console.log(msg);
        }
    }
}

