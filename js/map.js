function initMap(lat,lng) {

    let lngMax = max(lng);
    let latMin = min(lat);
    let lngMin = min(lng);
    let latMax = max(lat);


    let latCenter = (latMin+latMax)/2 ;
    let lngCenter = (lngMin+lngMax)/2;

    position = {lat: latCenter, lng: lngCenter};

    map = new google.maps.Map(document.getElementById('map'), {
        center: position,
    });

    let latlng = [];

    for(let i = 0; i <= lat.length - 1; i++ ){

        latlng[i] = new google.maps.LatLng(lat[i], lng[i]);

    }

    let latlngbounds = new google.maps.LatLngBounds();
    for (let i = 0; i < latlng.length; i++) {
        latlngbounds.extend(latlng[i]);
    }
    map.fitBounds(latlngbounds);

}

function showSpecificGraph(marker) {

    marker.addListener('click', function() {
        $('#tree').empty();

        //let a = "#" + marker.title;
        let root = marker.title;
        //$(a).show();
        createTree(root,jsap,"#tree");


    });

    marker.addListener('dblclick', function() {

        let a = "#" + marker.title;
        $(a).hide();

    });
}

function add_marker(lat,lng,name) {

    let len = lat.length - 1, i = 0;


    for(; i <= len; i++){


        let marker = new google.maps.Marker({
            position: {lat:lat[i],lng:lng[i]},
            map: map,
            title: name[i],
            animation: google.maps.Animation.DROP,
            icon: 'images/database24.png'

        });
        showSpecificGraph(marker);

    }
}