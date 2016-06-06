var currentUser = {};
var fbFunctions = {};

fbFunctions.statusChangeCallback = function(response){
  // console.log('Status Change Callback');
  // console.log(response);
  if( response.status === 'connected'){
    $("#loggedout").hide();
    $('#loggedin').show();
    fbFunctions.getUserInfo();
    maps.getGeolocation();
  }else if( response.status === 'not_authorized'){
    document.getElementById('status').innerHTML = 'Please log ' +'into this app.';
    $('#loggedin').hide();
    $('#loggedout').show();
  }else {
    document.getElementById('status').innerHTML = 'Please log ' +'into Facebook.';
    $('#loggedin').hide();
    $('#loggedout').show();
  }
}

fbFunctions.checkLoginState = function() {
  FB.getLoginStatus(function(response) {
    fbFunctions.statusChangeCallback(response);
  });
}

fbFunctions.fields = 'email,id,name,picture.height(961),friends';


fbFunctions.getUserInfo = function(){
  // console.log('getUserInfo()');
  FB.api('/me', {fields: fbFunctions.fields }, function(response){
    //Get info from the Users API that matches the info found here..
    // console.log( response );
    $.ajax({
      method: 'get',
      url: '/api/users/'+response.id,
      success: function(data){
        if( data.user[0] != null ){
          console.log( 'found one' );
          currentUser = data.user[0];
          users.renderProfileBox( data.user[0] );
        }
        else {
          console.log('creating');
          var newUser = {
            user: {
              displayName: response.name,
              email: response.email,
              facebookID: response.id,
              picture: response.picture,
              friends: response.friends.data,
              checkins: []
            }
          }
          currentUser = newUser.user;
          users.createNewUser( newUser );
          users.renderProfileBox( currentUser );
        }
      }
    })
  });
}


fbFunctions.otherUsers = 'name,id,picture.height(961)'

fbFunctions.findOneUser = function ( userID, cb ){
  FB.api('/'+userID, {fields: fbFunctions.otherUsers}, function(response){
    cb( response );
  });
}

fbFunctions.findManyUsers = function( arr, cb ){
  var newArr = [];
  for(var i=0; i < arr.length; i++){
    FB.api('/'+arr[i].facebook_id, {fields: fbFunctions.otherUsers}, function(response){
      newArr.push( [ response, this ]);
      cb([response, this]);
    }.bind( arr[i] ))
  }
}


fbFunctions.loginUser = function(){
  FB.login(function(response){
    if (response.authResponse) {
      fbFunctions.getUserInfo();
    }else {
      console.log('User did not fully login');
    }
  },{scope: 'public_profile,email,user_friends', return_scopes: true});
}

fbFunctions.logoutUser = function(){
  FB.logout(function(response){
    console.log( response );
  });
  $('#loggedin').hide();
  $('#loggedout').show();
}


window.fbAsyncInit = function(){

  FB.init({
    appId: '599539570205716',
    cookie: true,
    xfbml: true,
    status: true,
    oauth: true,
    version: 'v2.5'
  });

  FB.getLoginStatus(function(response) {
    // console.log('FB.getLoginStatus()');
    fbFunctions.statusChangeCallback(response);
  });

  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if( d.getElementById(id) ) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}
