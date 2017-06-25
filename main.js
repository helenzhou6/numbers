$(document).ready(function () {

	// VARIABLES/FUNCTIONS
	var $inputWrapper = $('.input');
	var $input = $inputWrapper.find('input');
	var $text = $('.js-text');

	// makes the shadow mirror the value
	var shadow = function(inputValue){
		$inputWrapper.attr('data-shadow', inputValue);
	}

	// updates the description: removes bolded property, and updates property and description
	var descripUpdate = function(value, data) {
		$('.property').find('.is-bold').removeClass('is-bold');
		if (data[value]) {
			$text.html(data[value].description);
			$('.' + data[value].property).addClass('is-bold');
		} else if (value === ''){
				$text.html('Type a number between <span class="number">0</span> to <span class="number">9999</span>');
		} else {
			$text.html("If you know a distinctive fact about this number, please <a href='mailto:efriedma@stetson.edu'>e-mail</a> me.");
		}
	}

	// INIT
	// focuses on input when document loaded
	$input.focus();

	// if there is already an input on refresh, updates the shadow
	if ($input.val()){
		shadow($input.val());
	}

	// UI
	// on keydown, prevents more than 4 digits being typed
	$input.on('keydown', function(e) {
		if ($(this).val().length > 3
			&& e.keyCode != 46
			&& e.keyCode != 8
			&& e.keyCode != 37
			&& e.keyCode !=39) {
				e.preventDefault();
			}
    });

	// once ajax done...
  $.ajax('/Numnumbers.json').done(function(data){

		// on input in input field, updates shadow and description/property, adds to history/url
    $input.on('input', function(e) {
			e.preventDefault();
      var inputVal = $(this).val();
			shadow(inputVal);
			descripUpdate(inputVal, data);
			history.pushState(inputVal, null, inputVal);
    });

		// if back or forward button, updates input, shadow, description
		window.addEventListener('popstate', function(e) {
			e.preventDefault();
			var prevVal = window.location.pathname.substring(1);
			descripUpdate(prevVal, data);
			$input.val(prevVal);
			shadow(prevVal);
		});
  });

});
