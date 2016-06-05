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
    service.getDetails( { placeId: place_id }, function( results, status ){
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
    courtID: results.place_id,
    checkins: []
  }

  if( currentUser.homecourt == court.courtID ){
    $('#courtStatus').text('Home Court');
  }else {
    $('#courtStatus').text('Court Name');
  }

  $('#courtName').text( court.name );

  modals.updateModal( results );


  for(var i=0; i<checkins.all.length; i++){
    if( results.place_id === checkins.all[i].court_id ){
      court.checkins.push( checkins.all[i] );
    }
  }
  // Court.checkins is never cleared until page is reloaded - why did I write this...
  $('#current-checkins').empty();

  if( court.checkins.length > 0 ){
    users.findManyUsers( court.checkins , maps.renderSocial );

    // Don't call this one - Call your users DB. You Have your own friends list dipshit...
    // fbFunctions.findManyUsers( court.checkins , maps.renderSocial );
  }else {
    var emptyCourt = $('<p class="subtitle is-5">Court is Empty</p>');
    $('#current-checkins').append( emptyCourt );
  }
}


function minTommss(minutes){
  var sign = minutes < 0 ? "-" : "";
  var min = Math.floor(Math.abs(minutes));
  var sec = Math.floor((Math.abs(minutes) * 60) % 60);
 return sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
}

//render social needs arr[0] to be user info - arr[1] to be checkin info


maps.renderSocial = function( arr ){
  //arr[0] is the user Data
  //arr[1] is the checkin data
  var hours;
  var minutes;
  var now = new Date();
  var then = new Date(arr[1].createdAt);
  var nowTime = (now.getHours()*60)+now.getMinutes()
  var thenTime = (then.getHours()*60)+then.getMinutes()
  var getTimeNorm = (nowTime-thenTime)/60;
  var getTimeRev = ( thenTime-nowTime)/60;

  if( getTimeNorm > 0 ){
    var time = minTommss( getTimeNorm );
    var timeArr = time.split(':');
    hours = timeArr[0];
    minutes = timeArr[1];
  }else {
    var time = minTommss( getTimeRev );
    var timeArr = time.split(':');
    hours = parseInt(timeArr[0]);
    minutes = parseInt(timeArr[1]);
  }

  var newSocial = $('.social-template').clone();
  newSocial.removeClass('social-template');
  newSocial.find('.checkinPic').attr('src', arr[0].picture.data.url);
  newSocial.find('.checkinUsername').text(arr[0].displayName);
  newSocial.find('.checkinUserId').text(arr[0].id );
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
  checkins.createNew( checkin );
}
