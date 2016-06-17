var checkins = {}

checkins.updateHome = function(){
  console.log( 'running update home');
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

  console.log('change court?: ', final !== currentHome );

  if (final !== currentHome ){
    var updating = currentUser;
    updating.homecourt = final;
    users.update( updating );

  }else {
    console.log(' no change needed ');
  }
}

checkins.getAll = function(){
  checkins.all = [];
  $.ajax({
    url: '/api/checkins',
    method: 'get',
    success: function( data ){
      checkins.all = data;
      //Yo I must have been drunk when I wrote this code.. The fuck is wrong with me...
      // for( var i=0; i<data.length; i++){
      //   checkins.all.push( data[i] )
      //   //Append the checkin, don't just push it. It won't update cause it's not angular!
      // }
      checkins.updateHome();
    }
    //Wow... calling console.log(data) really broke it all
  });
}

// [userinfo, checkininfo]
checkins.createNew = function( response ){
  console.log( 'running createNew Checkin');
  $.ajax({
    url: '/api/checkins',
    method: 'post',
    data: response,
    success: function( data ){
      //WHAT AM I DOING?!
      var arr = [ data.checkin ];
      //pushing the checkin into the user was a good idea... what does the
      //A user holds an array of checkins.. is it the id or the whole object?
      currentUser.checkins.push( data.checkin );
      checkins.getAll();
      // users.update( data ); // WHY THE FUCK WOULD YOU PASS CHECKIN DATA TO UPDATE A USER?

      //This next function is needed to render the social section of the sidebar for every person that is checked in at that location
      // maps.getCourtInfo( data.checkin.court_id );
      //But we are going to change it up and run that function using that data we are passing in to this function, instead of waiting for it to post to the DB and then render everything. Skip a step.

      //checkins.all will get updated anyway when the post request is completed because of the checkins.getAll() function in here.
    }
  })
}


checkins.deleteCheckin = function( response ){
  $.ajax({
    url:'/api/checkins/'+response.id,
    type: 'DELETE',
    success: function(){
      console.log(' its deleted ');
    }
  })
}
