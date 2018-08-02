function max(data) {
    var m = data[0], i = 1, n = data.length;

    for (; i <= n; ++i) {
        if (data[i] > m) {
            m = data[i];
        }
    }

    return m;
}

function min(data) {
    var m = data[0], i = 1, n = data.length;

    for (; i <= n; ++i) {
        if (data[i] < m) {
            m = data[i];
        }
    }

    return m;
}


 function createSvg(data, l){

    var svg = d3.select(l).selectAll("svg").data(data).enter().append(
        "svg").attr("class", "bullet").attr("width",
        width + margin.left + margin.right).attr("height",
        height + margin.top + margin.bottom).append("g").attr("transform",
        "translate(" + margin.left + "," + margin.top + ")").call(chart);

    var title = svg.append("g").style("text-anchor", "end").attr("transform",
        "translate(940,27)");

    title.append("text").attr("class", "title").text(function(d) {
        return d.title;
    });

    title.append("text").attr("class", "subtitle").attr("dy", "1em").text(
        function(d) {
            return d.subtitle;
        });

}

function divideData(data, l){
    var i = 0, d = [], j = 0;
    for(; i <= data.length - 1; i++){
        if(data[i].location === l){
            d[j] = data[i];
            j++;
        }
    }
    return d;
}

1,2,3,4,4,3

2,3,4


function countLocation(data){

    var i = 0, j = 0, isEqual = 0, k = 0, l = [];
    for(; i <= data.length - 1; i++){
        for(; j <= l.length - 1; j++){
            if( data[i].location === l[j] ){
                isEqual = 1;
                break;
            }
        }
        if(isEqual === 0){
            l[k] = data[i].location;
            k++;
        }
        isEqual = 0;
    }
    return l;
}


function humidex(T, h){

    //https://it.wikipedia.org/wiki/Punto_di_rugiada
    //https://en.wikipedia.org/wiki/Humidex

    //Approssimazione di Magnus-Tetens

    //umidità non %
    var hr = h / 100;

    var alfa = (( 17.27 * T ) / ( 237.7 + T )) + Math.log(hr);

   //dew point
    var Tdp = ( 237.7 * alfa ) / ( 17.27 - alfa );

    //humidex

    var b = 5417.7530 * ( ( 1 / 273.16 ) - ( 1 / (273.15 * Tdp) ) ) ;

    var H = T + 0.5555 * ( 6.11 * Math.E ^ (b) - 10 );

    return H;
}



