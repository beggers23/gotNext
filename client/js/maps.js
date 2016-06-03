var maps = {}

maps.map;
maps.position;
var service;
var infoWindow;

maps.getGeolocation = function(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      maps.position = { lat: position.coords.latitude, lng: position.coords.longitude };
      maps.initMap();
    }, function(){
      handleLocationError(true, infoWindow, maps.map.getCenter() );
    })
  } else {
    handleLocationError(false, infoWindow, maps.map.getCenter() );
  }
}

maps.initMap = function(){
  checkins.getAll();
  infoWindow = new google.maps.InfoWindow({ map: maps.map });
  var mapOptions = {
    center: maps.position,
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }

  maps.map = new google.maps.Map(document.getElementById('map'), mapOptions);

  var currentPosition = new google.maps.Marker({
    position: maps.position,
    map: maps.map,
    icon: { url: 'images/currentpos.png', scaledSize: new google.maps.Size(25,25)}
  });

  var request = {
    location: maps.position,
    radius: '1000',
    query: 'basketball'
  }

  service = new google.maps.places.PlacesService(maps.map);
  service.textSearch( request, maps.callback);
}

maps.createMarker = function( venue ){
  var marker = new google.maps.Marker({
    position: venue.geometry.location,
    map: maps.map,
    icon: {url: 'images/hoop.png', scaledSize: new google.maps.Size(25, 52)}
  });
  marker.addListener( 'click', function(){
    var htmlElement =
    '<div class="card">'+
      '<div class="card-header">'+
        '<h1 class="card-header-title title is-4" id="venue-name" >'+venue.name+'</h1>'+
      '</div>'+
      '<div class="card-content">'+
        '<p>'+venue.formatted_address+'</p>'+
        '<span id="venue-id" style="display:none">'+venue.place_id+'</span>'+
      '</div>'+
      '<div class="card-footer">'+
        '<a class="card-footer-item" onclick="maps.getCourtInfo()"> Court Info </a>'+
        '<a class="card-footer-item" onclick="maps.checkIn()"> Check in </a>'+
      '</div>'+
    '</div>'
    infoWindow.setContent(htmlElement);
    infoWindow.open(maps.map, marker);
  });
}

maps.callback = function( results, status ){
  if(status == google.maps.places.PlacesServiceStatus.OK){
    for(var i=0; i< results.length; i++){
      var place = results[i];
      maps.createMarker(place);
    }
  }
  maps.renderHomecourt()
}

maps.renderHomecourt = function(){
  if( currentUser.homecourt ){
    var request = {
      placeId: currentUser.homecourt
    }
    service = new google.maps.places.PlacesService( maps.map );
    service.getDetails( request , function( results, status){
      maps.updateSidebar( results );
    });
  }
}

maps.getCourtInfo = function( place_id ){
  service = new google.maps.places.PlacesService( maps.map );
  if( place_id ){
    service.getDetails( {placeId: place_id }, function( results, status ){
      maps.updateSidebar( results );
    })
  } else {
    var gathered = $('#venue-id').text();
    service.getDetails( { placeId: gathered }, function(results, status){
      maps.updateSidebar( results );
    })
  }
}



maps.updateSidebar = function( results ){
  var court = {
    name: results.name,
    address: results.formatted_address,
    courtID: results.court_id,
    checkins: []
  }
  $('#courtName').text( court.name );

  modals.updateModal( results );

  for(var i=0; i<checkins.all.length; i++){
    if( results.place_id === checkins.all[i].court_id ){
      court.checkins.push( checkins.all[i] );
    }
  }
  $('#current-checkins').empty();
  if( court.checkins.length > 0 ){
    fbFunctions.findManyUsers( court.checkins , maps.renderSocial );
  }else {
    var emptyCourt = $('<p class="subtitle is-5">Court is Empty</p>');
    $('#current-checkins').append( emptyCourt );
  }
}

maps.renderSocial = function( arr ){
  var hours;
  var minutes;
  var now = new Date();
  var then = new Date(arr[1].createdAt);
  var difference;
  if( then.getHours() > now.getHours()) {
    if( then.getMinutes() > now.getMinutes()){
      minutes = then.getMinutes() - now.getMinutes();
    } else {
      minutes = now.getMinutes() - then.getMinutes();
    }
    hours = ( then.getHours() - now.getHours() );
  }else {
    if( then.getMinutes() > now.getMinutes()){
      minutes = then.getMinutes() - now.getMinutes();
    } else {
      minutes = now.getMinutes() - then.getMinutes();
    }
    hours = ( now.getHours() - then.getHours() );
  }

  var newSocial = $('.social-template').clone();
  newSocial.removeClass('social-template');
  newSocial.find('.checkinPic').attr('src', arr[0].picture.data.url);
  newSocial.find('.checkinUsername').text(arr[0].name);

  if( hours > 0 ){
    newSocial.find('.checkinTime').text('Checked in '+hours+' hours, '+minutes+' minutes ago.');
  }else{
    newSocial.find('.checkinTime').text('Checked in '+minutes+' minutes ago.');
  }
  $('#current-checkins').append(newSocial);
}


maps.checkIn = function(){
  var place_id = $('#venue-id').text();
  var checkin = {
    court_id: place_id,
    user_id: currentUser._id,
    facebook_id: currentUser.facebookID
  }
  currentUser.checkins.push( checkin.court_id );
  var userData = currentUser;
  maps.getCourtInfo( place_id );
  users.update( userData );
  checkins.createNew( checkin );
}
