var app = angular.module('GotNext', []);
app.controller('MainController', function( $compile, $scope, $http, $location) {

  $scope.currentUser;
  $scope.court = {};

  $http.get('/user').then(function(response){
    $scope.currentUser = response.data.user ;
    console.log( $scope.currentUser);
  });

  $scope.checkinsArray;
  $http.get('/api/checkins').then(function(response){
    $scope.checkinsArray = response.data
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
      map: $scope.map,
      icon: {url: 'images/hoop.png', scaledSize: new google.maps.Size(25, 50)}
    });

    marker.addListener( 'click', function(){
      var htmlElement =
      '<div class="card">'+
        '<div class="card-header">'+
          '<h1 class="card-header-title is-large">'+venue.name+'</h1>'+
        '</div>'+
        '<div class="card-content">'+
          '<p>'+venue.formatted_address+'</p>'+
        '</div>'+
        '<div class="card-footer">'+
          '<a class="card-footer-item" ng-click=courtInfo(\''+venue.place_id+'\')> Court Info </a>'+
          '<a class="card-footer-item" ng-click=saveHome(\''+venue.place_id+'\')>Home Court</a>'+
          '<a class="card-footer-item" ng-click=checkIn(\''+venue.place_id+'\')> Check in </a>'
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
  //FIGURE OUT HOW TO GET INFO FROM THE GOOGLE PLACES API
  $scope.saveHome = function( courtID ){
    $scope.currentUser.homecourt = courtID;
    var updates = $scope.currentUser;
    $http.put('/api/users/'+$scope.currentUser._id, updates).then(function(response){
      console.log(response.data);
      $scope.courtInfo( $scope.currentUser.homecourt );
    });
  }

  $scope.courtInfo = function( venueID ){
    var request = {
      placeId: venueID
    }
    service = new google.maps.places.PlacesService( $scope.map );
    service.getDetails( request , function(results, status){
      $scope.$apply(function() {
        $scope.court.name = results.name;
        $scope.court.address = results.formatted_address;
        $scope.court.phone = results.formatted_phone;
        $scope.court.checkins = [];
        for(var i=0; i< $scope.checkinsArray.length; i++){
          if($scope.checkinsArray[i].court_id == results.place_id){
            $scope.court.checkins.push( $scope.checkinsArray[i] );
          }
        }
      });
    });
  }
  //TODO access the Facebook Friends list and the other things that are missing
  //Friends list will only return friends who have downloaded and signed in to the app - perfect
  //Need to get ability to create a facebook message group - not sure if do able but would be dope.





  //Then need to set up a Sockets chat for at the court //Seeming less likely as I draw up the plans.

  $scope.checkIn = function(result){
    var checkin = {
      court_id: result,
      user_id: $scope.currentUser._id,
      facebook_id: $scope.currentUser.facebookID
    }
    $http.post('/api/checkins', checkin ).then(function(response){
      $scope.checkinsArray.push(response.data.checkin);
    });
  }

});
