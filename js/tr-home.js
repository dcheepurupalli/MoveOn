$(document).ready(function(){

    $('#home-bookNow').off().on('click' ,function(){
        getLatitudeLongitude('from-location')
        toggleOverlay();
    });

    $('.overlay-close').off().on('click', function(){
        toggleOverlay();
    })

    $(window).scroll(function(){
        scrollPage();
    });
});

$(window).load(function(){
    locationAutoComplete('from-location');
    locationAutoComplete('to-location');
    //mapsLocationFinder();
});



function locationAutoComplete(documentId){
    var address = (document.getElementById(documentId));
    var autocomplete = new google.maps.places.Autocomplete(address);
    autocomplete.setTypes(['geocode']);
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }
        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }
    });
}
/*Get Longitude and Latitude from Input box*/
function getLatitudeLongitude(id) {
    geocoder = new google.maps.Geocoder();
    var address = document.getElementById(id).value;
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            mapsLocationFinder(results[0].geometry.location.lat(), results[0].geometry.location.lng())
        }
        else {
            cosole.log("Location provided is not found" + status);
        }
    });
}

function getAddressFromLatLng(latlng){
    var latlng = new google.maps.LatLng(latlng.lat(),latlng.lng());
    var geocoder = geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                console.dir(results);
                alert("Location: " + results[0].formatted_address);
            }
        }
    });
}


function mapsLocationFinder(latitude ,longitude){
    var mapCanvas = document.getElementById('map-canvas');
    latLong = new google.maps.LatLng(latitude, longitude);
    var mapOptions = {
        center: latLong,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(mapCanvas, mapOptions)
    var marker=new google.maps.Marker({
        map: map,
        position:latLong,
        draggable: true
    });
    marker.setMap(map);

    google.maps.event.addListener(marker, 'dragend', function() {
        //updateMarkerStatus('Drag ended');
        //geocodePosition(marker.getPosition());
        getAddressFromLatLng(marker.getPosition());
        //alert(marker.getPosition())
    });
}


function toggleOverlay() {
    var overlayStatus = $('div.overlay');
    if(overlayStatus.hasClass('open')){
        overlayStatus.removeClass('open').addClass('close');
    }else{
        overlayStatus.removeClass('close').addClass('open');
    }
}

function scrollPage() {
    var sy = window.pageYOffset || $('.nav-head.nav-home').scrollTop;
    if ( sy >= 0 ) {
        $('.nav-head.nav-home').addClass('sticky-header');
    }
    else {
        $('.nav-head.nav-home').removeClass('sticky-header');
    }
}

/*var longLatLocation = function(logitude, latitude){
    this.logitude = logitude;
    this.latitude = latitude;

    this.getLongitude = function(){
        return this.logitude;
    }
    this.getLatitude = function(){
        return this.latitude;
    }
}*/


function validateBookForm(){

}