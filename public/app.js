$.getJSON('/articles', function(data){
    for (var i=0; i<data.length; i++){

        $('#arcticleDIV').append()
    }
})


$(document).on('click', 'p', function(){
    $('#notesDIV').empty();

    var idclicked = $(this).attr('data_id');
})