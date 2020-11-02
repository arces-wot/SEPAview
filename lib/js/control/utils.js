
function generateID(){
    var dt = new Date().getTime();
    var uuid = 'uuid_xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return CSS.escape(uuid);
}

//function max(data) {
//    let m = data[0], i = 1, n = data.length;
//    for (; i <= n; ++i) {
//        if (data[i] > m) {
//            m = data[i];
//        }
//    }
//    return m;
//}
//
//function min(data) {
//    let m = data[0], i = 1, n = data.length;
//    for (; i <= n; ++i) {
//        if (data[i] < m) {
//            m = data[i];
//        }
//    }
//    return m;
//}
//
//// Get all the observations of a specific location "l"
//function divideData(data, l){
//    let i = 0, d = [], j = 0;
//    for(; i <= data.length - 1; i++){
//        if(data[i].location === l){
//            d[j] = data[i];
//            j++;
//        }
//    }
//    return d;
//}
//
//function countLocation(data){
//    let i , j, isEqual = 0, k = 0, l = [];
//
//    for(i = 0; i <= data.length - 1; i++){
//        for(j = 0; j <= l.length; j++){
//            if( l[j-1] === data[i].location ){
//                isEqual = 1;
//            }
//        }
//        if(isEqual === 0){
//            l[k] = data[i].location;
//            k++;
//        }else{
//            isEqual = 0;
//        }
//    }
//
//    return l;
//}
//
//function humidex(T, h){
//    //https://it.wikipedia.org/wiki/Punto_di_rugiada
//    //https://en.wikipedia.org/wiki/Humidex
//
//    //Approssimazione di Magnus-Tetens
//    //umidità non %
//    let hr = h / 100;
//    let alfa = (( 17.27 * T ) / ( 237.7 + T )) + Math.log(hr);
//   //dew point
//    let Tdp = ( 237.7 * alfa ) / ( 17.27 - alfa );
//    //humidex
//    let b = 5417.7530 * ( ( 1 / 273.16 ) - ( 1 / (273.15 * Tdp) ) ) ;
//    let H = T + 0.5555 * ( 6.11 * Math.E ^ (b) - 10 );
//
//    return H;
//}
