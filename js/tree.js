function createTree(root, jsapObj, r){

    openNav();

    //queries = "SELECT * where { ?observation rdf:type sosa:Observation. ?child rdf:type schema:Place . "+ root +" schema:containsPlace ?child }";

    queries = "SELECT * where { arces-monitor:"+ root +" schema:containsPlace ?child . ?child rdf:type schema:Place; schema:name ?name }";

    prefixes = "";
    for (ns in jsapObj["namespaces"]) {
        prefixes += "PREFIX " + ns + ":<"+ jsapObj["namespaces"][ns] + ">";
    }

    query = prefixes + " " + queries;

    const sepa = Sepajs.client;

    sepa.subscribe(query,{
            next(val) {
                console.log("Data received: " + val);
                msg = JSON.parse(val);

                child = [];
                names = [];

                if (msg["notification"] !== undefined) {

                    len = msg["notification"]["addedResults"]["results"]["bindings"].length - 1;
                    for (index = 0; index <= len; index++) {

                        binding = msg.notification.addedResults.results.bindings[index];

                        c = binding.child.value;
                        n = binding.name.value;
                        child.push(c);
                        names.push(n);
                    }

                    for(i = 0; i < child.length; i++){

                        if(child[i] !== ""){

                            id_li = child[i].slice(34,child[i].length);
                            $(r).append("<li id='" + id_li + "'></li>");

                            console.log(">>>>>>>>>>>"+ id_li );

                            id_span = id_li + "_span";
                            $("#" + id_li).append("<span id='" + id_span +  "' class=\"caret\"></span>");
                            $("#" + id_li).append(names[i]);

                            id_ul= id_li + "_ul";
                            $(r).append("<ul id='" + id_ul + "' class=\"nested\"></ul>");

                            $("#" + id_ul).append(createTree(id_li,jsap,"#"+ id_li ));


                        }else if(child[i]){
                            console.log("r:------------>"+r);
                            $(r).hide(r + "_span");
                        }

                    }


                } else { console.log(msg); }},
            error(err) { console.log("Received an error: " + err) },
            complete() { console.log("Server closed connection ") }, },

        {host:jsapObj["host"]});



    /*var toggler = document.getElementsByClassName("caret");
    var i;

    for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function() {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
    }
*/

}