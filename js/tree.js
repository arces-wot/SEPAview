function createTree(root, jsapObj, r){

    openNav();

    queries = "SELECT * where { arces-monitor:"+ root +" schema:containsPlace ?child ; schema:name ?nameRo . ?child rdf:type schema:Place; schema:name ?nameCh }";

//    queries = "SELECT * where { arces-monitor:"+ root +" schema:containsPlace ?child . ?child rdf:type schema:Place; schema:name ?name }";

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

                child = [""];
                namesCh = [""];
                namesRo = [""];
                if (msg["notification"] !== undefined) {

                    len = msg["notification"]["addedResults"]["results"]["bindings"].length - 1;
                    for (index = 0; index <= len; index++) {

                        binding = msg.notification.addedResults.results.bindings[index];

                        c = binding.child.value;
                        nCh = binding.nameCh.value;
                        nRo = binding.nameRo.value;
                        child.push(c);
                        namesCh.push(nCh);
                        namesRo.push(nRo);
                    }

                    console.log(child.length);

                     if(child.length === 1){

                        $("#Mars").show();
                        //$("#" + root).show();


                    }else{
//help
                        for (i = 1; i < child.length; i++) {

                            id_li = child[i].slice(34, child[i].length);
                            id_ul = id_li + "_ul";

                            $(r).append("<ul id='" + id_ul + "'></ul>");
                            $(r).append("<li id='" + id_li + "'></li>");
                            $("#" + id_li).append(namesCh[i]);


                            document.querySelector('#' + id_li).addEventListener("click", doSomething(id_ul, jsap, id_li), false);

                            //funzione wrapper
                            function doSomething(id_u, js, id_l) {
                                return function () {
                                    $("#" + id_u).append(createTree(id_l, js, "#" + id_l));
                                    console.log(id_l);
                                }
                            }

                        }
                    }


                } else { console.log(msg); }},
            error(err) { console.log("Received an error: " + err) },
            complete() { console.log("Server closed connection ") }, },

        {host:jsapObj["host"]});





}