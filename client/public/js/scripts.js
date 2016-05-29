var service;
var map;
function initMap() {
  var infoWindow = new google.maps.InfoWindow({map: map});
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {lat: position.coords.latitude, lng: position.coords.longitude};

      var mapOptions = {
        center: pos,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      map = new google.maps.Map(document.getElementById('map'), mapOptions);

      var currentPosition = new google.maps.Marker({
        position: pos,
        map: map,
        icon: {url: '/images/currentpos.png', scaledSize: new google.maps.Size(25,25)}
      });

      var request = {
        location: pos,
        radius: '500',
        types: ['basketball courts']
      }

    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}



$(document).ready(function(){
  console.log('loaded client side');
})
