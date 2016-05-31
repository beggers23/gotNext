var app = angular.module('GotNext', []);
app.controller('MainController', function( $compile, $scope, $http) {
  $scope.currentUser;
  $http.get('/api/users').then(function(response){
    $scope.currentUser = response.data[4];
    console.log( response.data );
  });

  $scope.map;
  $scope.position;
  var service;
  var infoWindow;

  $scope.getGeolocation = function(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position){
        $scope.position = { lat: position.coords.latitude, lng: position.coords.longitude };
        $scope.initMap();
      }, function(){
        handleLocationError(true, infoWindow, $scope.map.getCenter() );
      })
    } else {
      handleLocationError(false, infoWindow, $scope.map.getCenter() );
    }
  }

  $scope.getGeolocation();

  $scope.initMap = function(){

    infoWindow = new google.maps.InfoWindow({ map: $scope.map });
    var mapOptions = {
      center: $scope.position,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var currentPosition = new google.maps.Marker({
      position: $scope.position,
      map: $scope.map,
      icon: { url: 'images/currentpos.png', scaledSize: new google.maps.Size(25,25)}
    });

    var request = {
      location: $scope.position,
      radius: '1000',
      query: 'basketball'
    }

    service = new google.maps.places.PlacesService($scope.map);
    service.textSearch( request, $scope.callback);
  }

  $scope.createMarker = function( venue ){

    var marker = new google.maps.Marker({
      position: venue.geometry.location,
      map: $scope.map
    });

    marker.addListener( 'click', function(){
      var htmlElement =
      '<div class="info-window">'+
          '<h2>'+venue.name+'</h2>'+
          '<p>'+venue.formatted_address+'</p>'+
        '<div class="info-content">'+
          '<button class="court-info" ng-click=courtInfo(\''+venue.place_id+'\')> Court Info </button>'+
          '<button class="checkin-btn" ng-click=checkIn(\''+venue.place_id+'\')> Check in </button>'
        '</div>'+
      '</div>'

      var compiled = $compile(htmlElement)($scope);
      infoWindow.setContent(compiled[0]);
      infoWindow.open($scope.map, marker);
    });
  }

  $scope.callback = function( results, status ){
    if(status == google.maps.places.PlacesServiceStatus.OK){
      for(var i=0; i< results.length; i++){
        var place = results[i];
        //console.log( place );
        $scope.createMarker(place);
      }
    }
  }
  //TODO Court Info Page
  //CANT GET INFO FROM THIS API LINK
  $scope.courtInfo = function( venueID ){
    $http.get('https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyCwMlqGemsgxapOyVFfYwMpmCNv82-3Sko&placeid='+venueID).then(function(response){
      console.log( response)
    });
  }

  //TODO access the Facebook Friends list and the other things that are missing
  //Friends list will only return friends who have downloaded and signed in to the app - perfect

  //Need to get ability to create a facebook message group - not sure if do able but would be dope.

  //Then need to set up a Sockets chat for at the court

  //TODO SOLVE THE CHECKINS ISSUE
  ///Presently is not submitting the court object data to the DB. It is creating a checkin however. Not sure why it's not grabbing proper info.
  $scope.checkinsArray;

  $http.get('/api/checkins').then(function(response){
    $scope.checkinsArray = response.data
    console.log( response.data );
  });

  $scope.checkIn = function(result){
    var checkin = {
      court_id: result,
      user_id: $scope.currentUser._id,
      facebook_id: $scope.currentUser.facebookID
    }

    $http.post('/api/checkins', checkin ).then(function(response){
      console.log( response.data );
    });
  }

});
