function createSvg(data, l){

    let svg = d3.select(l).selectAll("svg").data(data).enter().append(
        "svg").attr("class", "bullet").style("margin-top","30px").attr("width",
        width + margin.left + margin.right).attr("height",
        height + margin.top + margin.bottom).append("g").attr("transform",
        "translate(" + margin.left + "," + margin.top + ")").call(chart);

    let title = svg.append("g").style("text-anchor", "end").attr("transform",
        "translate(940,27)");

    title.append("text").attr("class", "title").text(function(d) {
        return d.title;
    });

    title.append("text").attr("class", "subtitle").attr("dy", "1em").text(
        function(d) {
            return d.subtitle;
        });

    for(let i = 0; i <= data.length - 1; i++){

        id_a = data[i].location.substr(1, l.length - 1) + i || {};
        id_div = data[i].location.substr(1, l.length - 1) + "_div_" + i;
        if(document.getElementById(id_a) === null && document.getElementById(id_div) === null &&  data[i].title !== "Notifications"){

            $(l).append("<div id='"+id_div+"' class='div_button' style='position:relative;height:50px;width: 130px;border: #020202 1px solid; " +
                "margin-left: 45%;'></div>");
            $("#"+id_div).append("<a id='"+ id_a +"' data-quantity='"+ data[i].quantities+ "'" +
                "data-title='"+ data[i].title +"' class='button' href='./indexAnalitics.html' target='_blank' >HISTORY</a>")
        }
    }

    let buttons = document.getElementsByClassName("button");
    let buttonsCount = buttons.length;
    for (let j = 0; j < buttonsCount; j++) {
        buttons[j].onclick = function() {
            x = this.dataset.quantity;
            tit = this.dataset.title;
        }
    }
}
