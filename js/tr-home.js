$(document).ready(function(){

    initialize();
    $('#home-bookNow').off().on('click' ,function(){
        getMarkerLocations();
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
});

//Global Variables
function initialize(){
    tr_mapCanvas = document.getElementById('map-canvas');
    tr_latLng = new google.maps.LatLng('12.9667', '77.5667');
    tr_mapOption = {
        center: tr_latLng,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    tr_map = new google.maps.Map(tr_mapCanvas, tr_mapOption);

    tr_markersLocations = [];
    tr_rawLocations = ["from-location","to-location"];
}



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
/*function getLatitudeLongitude(id) {
    geocoder = new google.maps.Geocoder();
    var address = document.getElementById(id).value;
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            mapsLocationFinder(results[0].geometry.location.lat(), results[0].geometry.location.lng())
        }
        else {
            console.log("Location provided is not found" + status);
        }
    });
}*/

/*function mapsLocationFinder(latitude ,longitude){
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
        getAddressFromLatLng(marker.getPosition());
    });
}*/



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

function getMarkerLocations(){
   for(var i= 0; i < tr_rawLocations.length; i++){
       geocoder = new google.maps.Geocoder();
       var address = $('#'+tr_rawLocations[i]).val();
       if(tr_rawLocations[i] == 'to-location'){
           geocoder.geocode({ 'address': address}, function(results, status) {
               if (status == google.maps.GeocoderStatus.OK) {
                   setDropMarker(results[0].geometry.location);
                   tr_markersLocations.push(results[0].geometry.location);
               }
               else {
                   console.log("Location provided is not found" + status);
               }
           });
       }else{
           geocoder.geocode({ 'address': address}, function(results, status) {
               if (status == google.maps.GeocoderStatus.OK) {
                   setPickUpMarker(results[0].geometry.location);
                   tr_markersLocations.push(results[0].geometry.location);
               }
               else {
                   console.log("Location provided is not found" + status);
               }
           });
       }
   }
}

/*function setMarkers(latitude, longitude){
    if(latitude && longitude){
        tr_markersLocations.push(new google.maps.LatLng(latitude, longitude));
        var latlng = new google.maps.LatLng(latitude, longitude);
        var marker= new google.maps.Marker({
            map: tr_map,
            position: latlng,
            draggable: true
        });
        marker.setMap(tr_map);
        showAllMarkersInZoom();
        google.maps.event.addListener(marker, 'dragend', function() {
            console.dir(this);
            getAddressFromLatLng(marker.getPosition());
        });
    }
}*/

function showAllMarkersInZoom(){
    var bounds = new google.maps.LatLngBounds();
    for(var i in tr_markersLocations){
        bounds.extend(tr_markersLocations[i]);
    }
    tr_map.fitBounds(bounds);
}

function getAddressFromLatLng(latlng, addressId){
    var latlng = new google.maps.LatLng(latlng.lat(),latlng.lng());
    var geocoder = geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                $(addressId).val(results[0].formatted_address);
            }
        }
    });
}


/* Drop the Markers and get the address while markers are dragged*/
function setPickUpMarker(latLng){
   var pickUpMarkerLocation = "#from-Address-Overlay";
    if(latLng == null){
        latLng = tr_latLng;
    }
    var pickUpMarker  = new google.maps.Marker({
        map: tr_map,
        position: latLng,
        draggable: true
    });

    google.maps.event.addListener(pickUpMarker, 'dragend', function() {
        getAddressFromLatLng(pickUpMarker.getPosition(), pickUpMarkerLocation);
    });
}

/*Drop the Markers and get the address while marker dragged*/
function setDropMarker(latLng){
    var dropMarkerLocation = "#to-Address-Overlay";
    if(latLng == null){
        latLng = tr_latLng;
    }
    var dropMarker = new google.maps.Marker({
        map: tr_map,
        position: latLng,
        draggable: true
    });

    google.maps.event.addListener(dropMarker, 'dragend', function() {
        getAddressFromLatLng(dropMarker.getPosition(), dropMarkerLocation);
    });
}