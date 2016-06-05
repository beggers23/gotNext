var users = {};
var checkins = {
  all: []
};


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
  })
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
    url: '/api/users/'+currentUser._id,
    method: 'put',
    data: payload,
    success: function(data){
      checkins.updateHome();
    }
  });
}


checkins.updateHome = function(){

  var arr = currentUser.checkins;
  if( arr.length == 0){
    return null;
  }

  var modeMap = {};

  var courtID = arr[0].court_id
  var maxCount = 1;
  var final;

  for( var i=0; i < arr.length; i++){
    var el = arr[i].court_id;
    if(modeMap[el] == null){
      modeMap[el] = 1;
    }else{
      modeMap[el]++;
      maxCount = modeMap[el]
    }
    if(modeMap[el] >= maxCount){
      final = el;
    }
  }

  var currentHome = currentUser.homecourt;

  if (final != currentHome ){
    var updating = currentUser;
    updating.homecourt = final;
    users.update( updating );
  }
}

checkins.getAll = function(){
  checkins.all = [];
  $.ajax({
    url: '/api/checkins',
    method: 'get',
    success: function( data ){
      for( var i=0; i<data.length; i++){
        checkins.all.push( data[i] )
        //Append the checkin, don't just push it. It won't update cause it's not angular!
      }

      var count = 0;
      for( var j=0; j< checkins.all.length; j++){
        if( checkins.all[j].facebook_id === currentUser.facebookID ){
          count++;
        } else {
          console.log( checkins.all[j].facebook_id );
        }
      }
    }
  });
}

// [userinfo, checkininfo]
checkins.createNew = function( response ){
  console.log( response );
  $.ajax({
    url: '/api/checkins',
    method: 'post',
    data: response,
    success: function( data ){
      //WHAT AM I DOING?!
      var arr = [ data.checkin ];
      console.log( 'new checkin', data );
      //pushing the checkin into the user was a good idea... what does the
      //A user holds an array of checkins.. is it the id or the whole object?
      currentUser.checkins.push( data.checkin ) //? maybe ?

      checkins.getAll();
      checkins.updateHome();
      // users.update( data ); // WHY THE FUCK WOULD YOU PASS CHECKIN DATA TO UPDATE A USER?

      //This next function is needed to render the social section of the sidebar for every person that is checked in at that location
      users.findManyUsers( arr, maps.renderSocial );
    }
  })
}
