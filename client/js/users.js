//description for GA Profiles

//As a basketball player myself, I always found the pickup basketball scene to be quite intimidating. I wanted a way that I, as a pretty mediocre player, could meet up with people that were of a similar skill level so I could be a part of a fun and still competitive game.
//
// Got Next is my take on Foursquare for pick up basketball. Using the Facebook SDK, users are able to have social interaction with other users, add to a friends list, communicate through messages, as well as inside of a chat at each court, and will be to see how many players, and of what skill level, are playing at a court near by. Using Google Maps and Google Places, basketball courts are rendered on the map relative to the current users Geo Location.
//
// The application features a full functioning profile page where they can update and change any of the initial information taken from their Facebook profile ( name, email, photo ) to have a customized username and avatar if desired. Users are also able to leave comments and ratings on a certain court, as well as for other players.
//
// I plan to continue developing this application and eventually send it off for real world use. I think it is a product that can help fill a need in a niche that I very much would like to be more a part of. I don't think there is much that I would do differently if I started over, but there is a lot that I will continue to work on as a developer.


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
