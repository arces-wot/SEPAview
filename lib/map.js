function initMap(lat,lng) {

    var lngMax = max(lng);
    var latMin = min(lat);
    var lngMin = min(lng);
    var latMax = max(lat);


    var latCenter = (latMin+latMax)/2 ;
    var lngCenter = (lngMin+lngMax)/2;

    position = {lat: latCenter, lng: lngCenter};

    map = new google.maps.Map(document.getElementById('map'), {
        center: position,
    });

    var latlng = [];

    for(var i = 0; i <= lat.length - 1; i++ ){

        latlng[i] = new google.maps.LatLng(lat[i], lng[i]);

    }

    var latlngbounds = new google.maps.LatLngBounds();
    for (var i = 0; i < latlng.length; i++) {
        latlngbounds.extend(latlng[i]);
    }
    map.fitBounds(latlngbounds);

}

function showSpecificGraph(marker) {

    marker.addListener('click', function() {

        var a = "#" + marker.title;
        $(a).show();

    });

    marker.addListener('dblclick', function() {

        var a = "#" + marker.title;
        $(a).hide();

    });
}

function add_marker(lat,lng,name) {

    var len = lat.length - 1, i = 0;


    for(; i <= len; i++){


        var marker = new google.maps.Marker({
            position: {lat:lat[i],lng:lng[i]},
            map: map,
            title: name[i],
            animation: google.maps.Animation.DROP,
            icon: 'icon/database24.png'

        });





        showSpecificGraph(marker);

    }
}