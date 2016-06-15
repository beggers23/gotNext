var modals = {};


modals.updateModal = function( results ){
  $('#modalReviews').empty();
  if( results.reviews ){
    for (var i=0; i< results.reviews.length; i++){
      if( results.reviews[i].text.length > 10){
        var username = $('<span class="subtitle is-5">').text( results.reviews[i].author_name );
        var text = $('<span class="subtitle is-6">').text( results.reviews[i].text );
        var review = $('<p class="review">').append( username, $('<br>'), text );
        $('#modalReviews').append( review );
      }
    }
  }
  $('#modalName').text( results.name );
  $('#modalAddress').text( results.vicinity );

  if( results.rating ){
    $('#modalRating').text( 'Court Rating: '+ results.rating );
  }else {
    $('#modalRating').text('This court is not yet rated');
  }
}

modals.openOtherUsers = function( results ){
  var returned = results.innerHTML.split('\n');
  var attempt = $.parseHTML( returned[2] );
  var userId = attempt[1].innerText;
  users.findOne( userId );
}

var open;
modals.renderOtherUserBox = function( info ){
  var user = info.user[0]
  var displayName = user.displayName;
  var picture = user.picture.data.url;
  var checkins = user.checkins;
  var friends = user.friends;
  var homecourt = user.homecourt;

  $('#otherUserModal').empty();
  var newModal = $('.otherUserTemp').clone();
  newModal.removeClass('otherUserTemp');
  newModal.find('#friendButton').attr('name', user.facebookID+','+displayName );
  newModal.find('#otherUserName').text(displayName);
  newModal.find('#otherProfilePic').attr('src', picture );

  service = new google.maps.places.PlacesService( maps.map );
  service.getDetails( { placeId: homecourt }, function( results, status ){
    newModal.find('#otherHomeCourt').text(results.name);
    $('#otherUserModal').append(newModal);
    $('#otherUserModal').toggle('slide', 'left', 500);
    $('#xout').on('click', function(){
      $('#otherUserModal').toggle('slide', 'left', 500);
    });
  });
}

var pos;
modals.openMoreInfo = function(){
  if( pos ) {
    pos = false;
    $('#contentWindow').css({'top': '80vh'});
    $('#arrow').css({'transform':'rotate(0deg)', 'color':'#69707a'});
    $('#courtProfileModal').slideToggle('slow');
  }else {
    pos = true;
    $('#contentWindow').css({'top': '40vh'});
    $('#arrow').css({'transform':'rotate(-180deg)', 'color':'black'});
    $('#courtProfileModal').show();
  }
}

modals.showNewImageLink = function(){
  $('#currentUserProfilePicture').attr('src', $('#updateProfileUrl').val() );
}

modals.resetImage = function(){
  $('#currentUserProfilePicture').attr('src', currentUser.picture.data.url );
}

// var clydePic = "https://scontent.xx.fbcdn.net/v/t1.0-1/12524203_10205418162278191_2528683742764977441_n.jpg?oh=8e274615859ce6159dc5e7a26219edf4&oe=58065FC2"

modals.renderUserProfile = function() {
  $('#feed').empty();
  if( $('#map').is(':visible') ){
    $('#map').fadeOut(500, function(){
      $('#currentUserProfileModal').fadeIn(500);
    });
  }else if( $('#currentUserProfileModal').is(':visible')){
    $('#currentUserProfileModal').fadeOut(500, function(){
      $('#map').fadeIn(500);
    })
  }
  $('#updateProfileUrl').val( currentUser.picture.data.url );
  $('#currentUserProfilePicture').attr('src', currentUser.picture.data.url );
  $('#currentUserDisplayName').val(currentUser.displayName);
  $("#currentUserEmail").val(currentUser.email);
  $('#currentUserCheckinTotal').text('Total Checkins: '+ currentUser.checkins.length);
  var friends = currentUser.friends;
  users.findUserFriends(friends, modals.renderUserFriends );
}

modals.renderUserFriends = function( user ){
  var friend ="<section class='friend-left'>"+
      "<div class='hunnid'>"+
        "<img src="+user.picture.data.url+" class='friend-img'>"+
      "</div>"+
    "</section>"+
    "<section class='friend-right'>"+
      "<p class='title is-4 friendName'>"+user.displayName+"</p>"+
      "<a class='button hunnid'>Send Message</a>"+
      "<a class='button hunnid'>Delete Friend</a>"+
    "</section>"
  var newDiv = $('<div class="friend-temp">').append( friend );
  $('#feed').append( newDiv );
}



modals.updateUser = function() {
  // currentUserDisplayName
  // currentUserEmail
  // updateProfileUrl
  var updating = currentUser;
  var truths = 0;

  $('#currentUserProfilePicture').attr('src', $('#updateProfileUrl').val() );
  $('#userProfilePic').attr('src', $('#updateProfileUrl').val() );
  updating.displayName = $('#currentUserDisplayName').val();
  $('#userName').text(updating.displayName);
  updating.email = $('#currentUserEmail').val();
  updating.picture.data.url = $('#updateProfileUrl').val();


  users.update( updating );
}

modals.showDeleteModal = function(){
  $('#areyousure').toggleClass('notShowing');
}
modals.closeDeleteModal = function(){
  $('#areyousure').toggleClass('notShowing');
}


modals.deleteUser = function() {
  var id = currentUser.facebookID;

  $.ajax({
    url: '/api/users/'+id,
    method: 'delete',
    success: function( data ){
      console.log( 'bitch is dead ');
    }
  })
  fbFunctions.logoutUser();
}
