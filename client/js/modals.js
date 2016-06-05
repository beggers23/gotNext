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
    $('#arrow').css({'transform':'rotate(0deg)'});
    $('#courtProfileModal').slideToggle('slow');
  }else {
    pos = true;
    $('#contentWindow').css({'top': '40vh'});
    $('#arrow').css({'transform':'rotate(-180deg)'});
    $('#courtProfileModal').show();
  }
}

modals.showNewImageLink = function(){
  $('#currentUserProfilePicture').attr('src', $('#updateProfileUrl').val() );
}

// var clydePic = "https://scontent.xx.fbcdn.net/v/t1.0-1/12524203_10205418162278191_2528683742764977441_n.jpg?oh=8e274615859ce6159dc5e7a26219edf4&oe=58065FC2"

modals.renderUserProfile = function() {
  $('#map').toggle(700);
  $('#currentUserProfileModal').toggle(700);
  //currentUser.checkins
  //currentUser.friends
  //currentUser.displayName
  //currentUser.picture.data.url
  //currentUser.homecourt - get data from - Dealt with
  //currentUser.comments - if implemented
  $('#updateProfileUrl').val( currentUser.picture.data.url );
  $('#currentUserProfilePicture').attr('src', currentUser.picture.data.url );
  $('#currentUserDisplayName').val(currentUser.displayName);
  $("#currentUserEmail").val(currentUser.email);
  $('#currentUserCheckinTotal').text('Total Checkins: '+ currentUser.checkins.length);
}
