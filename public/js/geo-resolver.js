var addresses = [
    {
        "name": "Stanford Hospitals &amp; Clinics",
        "address": "300 Pasteur Drive, Stanford, CA, 94305"
    },
    {
        "name": "Arrillaga Center for Sports &amp; Recreation",
        "address": "341 Galvez Street, Stanford, CA 94305-6175"
    },
    {
        "name": "Blake Wilbur Building",
        "address": "900 Blake Wilbur Drive, Palo Alto, CA  94304"
    },
    {
        "name": "Byers Eye Institute at Stanford",
        "address": "2452 Watson Court, Palo Alto, CA 94303"
    },
    {
        "name": "California VitreoRetinal Center",
        "address": "2452 Watson Court, Palo Alto, CA 94303"
    },
    {
        "name": "Stanford Clinical Cancer Center",
        "address": "875 Blake Wilbur Drive, Stanford, CA 94305"
    },
    {
        "name": "Center for Education and Professional Development",
        "address": "1451 California Ave, Palo Alto, CA 94304"
    },
    {
        "name": "Hoover Pavillion",
        "address": "211 Quarry Road, Palo Alto, CA 94304"
    },
    {
        "name": "Lucile Packard Children's Hospital",
        "address": "725 Welch Road, Palo Alto, CA 94304"
    },
    {
        "name": "Psychiatry Building",
        "address": "401 Quarry Rd., Stanford, CA 94305"
    },
    {
        "name": "Stanford University Blood Center of Mountain View",
        "address": "515 South Drive, Suite #20, Mountain View, CA 94040"
    },
    {
        "name": "Menlo Medical Clinic (Adult &amp; Pediatric)",
        "address": "1300 Crane Street, Menlo Park, CA 94025"
    },
    {
        "name": "Menlo Medical Clinic (Adult)",
        "address": "321 Middlefield Road, Menlo Park, CA 94025"
    },
    {
        "name": "Stanford Medicine Outpatient Center",
        "address": "450 Broadway Street, Redwood City, CA 94063"
    },
    {
        "name": "Vaden Student Health (Stanford Students Only)",
        "address": "866 Campus Drive, Stanford, CA 94305"
    },
    {
        "name": "Stanford Medicine Imaging Center",
        "address": "451 Sherman Avenue, Palo Alto, CA 94306"
    },
    {
        "name": "Stanford Medical School Blood Center",
        "address": "780 Welch Road, Suite 100, Palo Alto, CA 94304"
    },
    {
        "name": "Stanford Primary Care, Portola Valley",
        "address": "3250 Alpine Road, Portola Valley, CA 94028"
    }
];

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

var positions = [];

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

var saveLocation = function(locationObj) {
    $.ajax({
        type: "POST",
        url: "/geo",
        data: locationObj,
        success: function(){
            console.log("saved:", locationObj);
        },
        dataType: "json"
    });
};

var placeMarkerByAddress = function(addressObj) {
    geocoder.geocode( { 'address': addressObj.address }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var isOpen = false;
            var position = results[0].geometry.location;

            // append geocode
            addressObj["loc"] = [position.lat(), position.lng()];
            saveLocation(addressObj);

            positions.push(new google.maps.LatLng(position.lat(), position.lng()));
            console.log('Success: ' + addressObj.address + ": " + position);
            var marker = new google.maps.Marker({
                map: map,
                position: position
            });
            var infoWindow = createInfoWindow(addressObj.name, addressObj.address, position );

            /*
             google.maps.event.addListener(marker, 'click', function() {
             if (!isOpen) {
             // map.setCenter(position);
             infoWindow.open(map, marker);
             } else {
             infoWindow.close();
             }
             isOpen = !isOpen;
             });
             */

            google.maps.event.addListener(marker, 'mouseover', function() {
                infoWindow.open(map, marker);
            });

            google.maps.event.addListener(marker, 'mouseout', function() {
                infoWindow.close();
            });
        } else {
            console.log('Failed: ' + addressObj.address + ": " + status);
        }
    });
};

var zoomToFit = function() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, n = positions.length; i < n; i++) {
        bounds.extend(positions[i]);
    }
    map.fitBounds(bounds);
};

var initialize = function() {
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    map.setOptions({styles: mapStyles});
    geocoder = new google.maps.Geocoder();

    google.maps.event.addListener( map, 'maptypeid_changed', function() {
        console.log("type changed", map.getMapTypeId());
    });

    var count = addresses.length, i=0;
    var timeoutCycle = new gb.util.TimeOutCycle(500, function(){
        if (i < count) {
            zoomToFit();
            placeMarkerByAddress(addresses[i]);
            i++;
        } else {
            console.log("timeout killed.");
            timeoutCycle.Stop();
        }
    });
    timeoutCycle.Start();
};



var map = null;
var geocoder = null;
google.maps.visualRefresh = true;
google.maps.event.addDomListener(window, 'load', initialize);