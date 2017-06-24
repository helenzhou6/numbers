$(document).ready(function () {
	var $inputWrapper = $('.input');
	var $input = $inputWrapper.find('input');
	var $text = $('.js-text');


	$input.focus();

	$input.on('keydown', function(e) {
		if ($(this).val().length > 3
			&& e.keyCode != 46
			&& e.keyCode != 8) {
				e.preventDefault();
			}
    });

  $.ajax('/Numnumbers.json').done(function(data){

    $input.on('input', function(e) {
      var inputVal = $(this).val();
      $inputWrapper.attr('data-shadow', $(this).val());
      $('.property').find('.is-bold').removeClass('is-bold');

      if (data[inputVal]) {
        $text.html(data[inputVal].description);
        $('.' + data[inputVal].property).addClass('is-bold');
      } else if (inputVal === ''){
          $text.html('Type a number between <span class="number">0</span> to <span class="number">9999</span>');
      } else {
        $text.html("If you know a distinctive fact about this number, please <a href='mailto:efriedma@stetson.edu'>e-mail</a> me.");
      }
    });

  });

});
