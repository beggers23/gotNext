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
  var user = info.users[0]
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


modals.openMoreInfo = function(){
  if( $('#map').height() > 300 ) {
    $('#map').css({'height': '40vh'});
    $('#contentWindow').css({'height': '50vh'});
    $('#arrow').css({'transform':'rotate(-180deg)'});
    $('#courtProfileModal').show();
  }else {
    $('#map').css({'height': '80vh'});
    $('#contentWindow').css({'height': '10vh'});
    $('#arrow').css({'transform':'rotate(0deg)'});
    $('#courtProfileModal').slideToggle('slow');
  }
}
