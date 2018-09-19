function link(markerName){

    const sepa = Sepajs.client;

    // PREFIXES
    prefixes = "";
    for (ns in jsap["namespaces"]) {
        prefixes += "PREFIX " + ns + ":<"+ jsap["namespaces"][ns] + ">";
    }

    query = prefixes + " "+ "SELECT * where { arces-monitor:"+ markerName +" schema:containsPlace ?child  }";

    sepa.subscribe(query,{
            next(val) {
                console.log("Data received: " + val);
                msg = JSON.parse(val);

                child = [];

                if (msg["notification"] !== undefined) {

                    len = msg["notification"]["addedResults"]["results"]["bindings"].length - 1;
                    for (index = 0; index <= len; index++) {

                        binding = msg.notification.addedResults.results.bindings[index];

                        ch = binding.child.value;
                        ch = ch.substr(33,ch.length - 1);

                        child.push(ch);
                    }





                } else { console.log(msg); }},
            error(err) { console.log("Received an error: " + err) },
            complete() { console.log("Server closed connection ") }, },

        {host:jsap["host"]});





}




