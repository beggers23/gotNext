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
    radius: '500',
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


maps.grabCourts = function( courtID, cb ){
  var newArr =[];
  for( var i=0; i<checkins.all.length; i++){
    if( courtID === checkins.all[i].court_id ){
      newArr.push( checkins.all[i] );
    }
  }
  cb( newArr );
}


maps.updateSidebar = function( results ){

  console.log( 'running update sidebar ');
  $('#current-checkins').empty();
  if( currentUser.homecourt === results.place_id ){
    console.log('same court');
    $('#courtStatus').text('Home Court');
    $('#currentUserHomeCourt').text( results.name );
  }else {
    console.log('different court');
    $('#courtStatus').text('Court Name');
  }
  $('#courtName').text( results.name );

  //Not registering the checkins in time...
  modals.updateModal( results );

  maps.grabCourts( results.place_id, function( data ){
    if( data.length > 0){
      users.findManyUsers( data, maps.renderSocial );
    }else{
      var emptyCourt = $('<p class="subtitle is-5">Court is Empty</p>');
      $('#current-checkins').append( emptyCourt );
    }
  });
}


// maps.renderIt = function( arr ){
//   console.log( arr );
//   // if( courtCheckins.length > 0 ){
//   //   users.findManyUsers( courtCheckins , maps.renderSocial );
//   //
//   //   // Don't call this one - Call your users DB. You Have your own friends list dipshit...
//   //   // fbFunctions.findManyUsers( court.checkins , maps.renderSocial );
//   // }else {
//   //   var emptyCourt = $('<p class="subtitle is-5">Court is Empty</p>');
//   //   $('#current-checkins').append( emptyCourt );
//   // }
//
// }


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
  console.log( 'running renderSocial ');
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
  newSocial.find('.checkinUserId').text(arr[0].facebookID );

  // if( arr[0].facebookID === currentUser.facebookID ){
  //   newSocial.find('.deleteCheckin').attr('name', arr[0]._id)
  //   newSocial.find('.deleteCheckin').removeClass("hidden");
  // }

  if( hours > 0 ){
    newSocial.find('.checkinTime').text('Checked in '+hours+' hours, '+minutes+' minutes ago.');
  }else if( isNaN( minutes )|| isNaN( hours ) || minutes === 0 ){
    newSocial.find('.checkinTime').text('Checked in just now');
  }else {
    newSocial.find('.checkinTime').text('Checked in '+minutes+' minutes ago.');
  }
  $('#current-checkins').append(newSocial);
}

maps.checkIn = function(){
  var place_id = $('#venue-id').text();
  var checkin = {
    court_id: place_id,
    facebook_id: currentUser.facebookID
  }
  checkins.all.push( checkin );
  maps.getCourtInfo( checkin.court_id );
  checkins.createNew( checkin );
}

// I can create a new checkin and update the sidebar separately. I don't need to pass the brand new checkin object that has been posted to the back end. I can just update it with this info...
