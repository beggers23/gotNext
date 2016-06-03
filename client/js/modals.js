var modals = {};


modals.updateModal = function( results ){
  for (var i=0; i< results.reviews.length; i++){
    if( results.reviews[i].text.length > 10){
      var username = $('<span class="subtitle is-5">').text( results.reviews[i].author_name );
      var text = $('<span class="subtitle is-6">').text( results.reviews[i].text );
      var review = $('<p class="review">').append( username, $('<br>'), text );
      $('#modalReviews').append( review );
    }
  }
  $('#modalName').text( results.name );
  $('#modalRating').text( 'Court Rating: '+ results.rating );
  $('#modalLocation').text( results.vicinity );

  console.log( results );
}
