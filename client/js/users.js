var users = {};
users.renderProfileBox = function( user ){
  $('#userName').text( user.displayName );
  $('#userProfilePic').attr('src', user.picture.data.url );
  maps.renderHomecourt();
}

users.addToFriends = function(){
  console.log(' Add To Friends ');
}

users.sendMessage = function() {
  console.log(' Send Message ');
}

users.findOne = function( fbId ){
  $.ajax({
    url: '/api/users/'+fbId,
    method: 'get',
    success: function( data ){
      modals.renderOtherUserBox( data );
    }
  });
}

var testUser = ['Dick Alabbafebieaj Martinazzistein', 'huamivg_martinazzistein_1464722290@tfbnw.net' , '1password2']


users.findManyUsers = function(arr, cb){
  //gets the data of every user in the DB. If the checkins in the array that is passed to the function have a facebookID that matches one from the user, they will be put into an array and passed to a function that will render their information on the sidebar in the "Current Players Section"
  $.ajax({
    method: 'get',
    url: '/api/users',
    success: function( data ){
      for(var i=0; i<arr.length; i++){
        for(var j=0; j<data.users.length; j++){
          if( arr[i].facebook_id === data.users[j].facebookID ){
            var newArr = [ data.users[j], arr[i] ];
            cb( newArr )
          }
        }
      }
    }
  });
}


users.createNewUser = function( data ){
  $.ajax({
    url: '/api/users',
    method: 'post',
    data: data,
    success: function(data){
      console.log(data);
    }
  })
}

users.update = function( payload ) {
  $.ajax({
    url: '/api/users/'+payload.facebookID,
    method: 'put',
    data: payload,
    success: function(data){
      currentUser = data;
    }
  });
}
