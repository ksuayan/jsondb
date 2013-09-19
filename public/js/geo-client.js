var addresses = null;
var positions = [];

var mapStyles = [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            { "color": "#4875b7" },
            { "lightness": 13 }
        ]
    },{
        "featureType": "water"  },{
        "elementType": "labels.text.fill",
        "stylers": [
            { "color": "#333333" }
        ]
    },
    {
        "featureType": "landscape.natural.terrain",
        "stylers": [
            { "hue": "#c3ff00" },
            { "saturation": -48 },
            { "lightness": -51 }
        ]
    },{
        "featureType": "road.highway",
        "stylers": [
            { "hue": "#ff6e00" },
            { "lightness": -1 },
            { "saturation": 13 }
        ]
    },{
        "featureType": "road.local",
        "stylers": [
            { "saturation": 21 },
            { "color": "#95cdcf" },
            { "lightness": 13 }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text",
        "stylers": [
            { "color": "#fff" }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            { "hue": "#ff8000" },
            { "color": "#e8be86" }
        ]
    }
];

var mapOptions = {
    center: new google.maps.LatLng(37.4344738, -122.1801845),
    zoom: 18,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP]
    }
};

var createInfoWindow = function(name, address, location) {
    var contentString = '<div id="content">'+
        // '<div id="siteNotice">this is  a test</div>'+
        '<h2 id="firstHeading" class="firstHeading">' + name +'</h2>'+
        '<div id="bodyContent">'+
        '<p>'+address+'</p>'+
        '<p>'+location+'</p>'+
        '</div>'+
        '</div>';

    return new google.maps.InfoWindow({
        content: contentString
    })
};


var placeMarkerByAddress = function(addressObj) {

    var position = new google.maps.LatLng(addressObj.loc[0], addressObj.loc[1]);
    positions.push(position);
    console.log('Success: ' + addressObj.address + ": " + position);
    var marker = new google.maps.Marker({
        map: map,
        position: position
    });
    var infoWindow = createInfoWindow(addressObj.name, addressObj.address, position );

    google.maps.event.addListener(marker, 'mouseover', function() {
        infoWindow.open(map, marker);
    });

    google.maps.event.addListener(marker, 'mouseout', function() {
        infoWindow.close();
    });
};

var zoomToFit = function() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, n = positions.length; i < n; i++) {
        bounds.extend(positions[i]);
    }
    map.fitBounds(bounds);
};

var onDataLoaded = function(data) {
    addresses = data.results;

    console.log("loaded:", data);
    for (var i= 0,n=addresses.length; i<n; i++) {
        placeMarkerByAddress(addresses[i]);
    }
    zoomToFit();
};

var getLocations = function() {
    $.ajax({
        type: "GET",
        url: "/geo",
        success: onDataLoaded,
        dataType: "json"
    });
};

var initialize = function() {
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    map.setOptions({styles: mapStyles});
    getLocations();
};

var map = null;

google.maps.visualRefresh = true;
google.maps.event.addDomListener(window, 'load', initialize);