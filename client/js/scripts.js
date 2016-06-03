var users = {};
var checkins = {
  all: []
};


users.renderProfileBox = function( user ){
  $('#userName').text( user.name );
  $('#userProfilePic').attr('src', user.picture.data.url );
  maps.renderHomecourt();
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

users.update = function( data ) {
  $.ajax({
    url: '/api/users/'+currentUser._id,
    method: 'put',
    data: data,
    success: function(data){
      console.log( data );
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
  var maxEl = arr[0]
  var maxCount = 1;
  for( var i=0; i<arr.length; i++){
    var el = arr[i];
    if(modeMap[el] == null){
      modeMap[el] = 1;
    }else{
      modeMap[el]++;
    }
    if(modeMap[el]>maxCount){
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  var currentHome = currentUser.homecourt;

  if (maxEl != currentHome ){
    currentUser.homecourt = maxEl;
    users.update( currentUser );
    //Alert, new home court
  }
  // maps.renderHomecourt();
}

checkins.getAll = function(){
  $.ajax({
    url: '/api/checkins',
    method: 'get',
    success: function( data ){
      for( var i=0; i<data.length; i++){
        checkins.all.push( data[i] )
      }
    }
  });
}

checkins.createNew = function( data ){
  $.ajax({
    url: '/api/checkins',
    method: 'post',
    data: data,
    success: function( data ){
      checkins.getAll();
      checkins.updateHome();
      maps.getCourtInfo( data.court_id );
    }
  })
}
