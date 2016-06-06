var users = {};
users.renderProfileBox = function( user ){
  $('#userName').text( user.displayName );
  $('#userProfilePic').attr('src', user.picture.data.url );
  maps.renderHomecourt();
}

users.addToFriends = function( result ){
  var deets = result.name.split(',');
  var newFriend = {
    id: deets[0],
    name: deets[1]
  }
  currentUser.friends.push( newFriend );
  var update = currentUser
  users.update( update );
}

users.removeFromFriends = function( ){
  var arr = currentUser.friends;
  name = 'Clyde';

  for(var i=0;i< arr.length; i++){
    if( arr[i].displayName === val ){
      //remove from friends list
      var newArr = arr.splice(i, 1);
    }
  }
}


var names = [
  { name: 'brendan'},
  { name: 'clyde' },
  { name: 'joe' },
  { name: 'bob' }
]

function findAndPop( val, arr ){

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

  //Testing it out with the renderUserFriends function - doesn't work cause the look is looking for arr[i].facebook_id which is specific to the checkins array, not the friends array that was pulled from Facebook info.
  $.ajax({
    method: 'get',
    url: '/api/users',
    success: function( data ){
      for(var i=0; i<arr.length; i++){
        for(var j=0; j<data.users.length; j++){
          if( arr[i].facebook_id === data.users[j].facebookID ){
            var newArr = [ data.users[j], arr[i] ];
            cb( newArr );
          }
        }
      }
    }
  });
}

users.findUserFriends = function( arr, cb){
  $.ajax({
    method: 'get',
    url: '/api/users',
    success: function( response ){
      //For all of the users in the data base, if their fbID matches the currentUsers friends fbID, they should move on...
      for(var i=0; i< response.users.length; i++){
        for(var k=0; k<arr.length; k++){
          if( response.users[i].facebookID === arr[k].id ){
            cb( response.users[i] );
          }
        }
      }
    }
  })
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
