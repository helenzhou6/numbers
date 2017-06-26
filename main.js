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
		var effectiveValue = parseInt(value);
		var description = "If you know a distinctive fact about this number, please <a href='mailto:efriedma@stetson.edu'>e-mail</a> me.";
		if (data[effectiveValue]) {
			description = data[effectiveValue].description;
			$('.' + data[effectiveValue].property).addClass('is-bold');
		} else if (value === ''){
				description = 'Type a number between <span class="number">0</span> to <span class="number">9999</span>';
		}
		$text.html(description);
		// with fade animations:
		// $text.fadeOut(50, function() {
		// 	$(this).html(description).fadeIn(50);
		// });
	}

	// INIT

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
			&& e.keyCode != 39
			|| e.keyCode === 69
			|| e.keyCode === 189
			|| e.keyCode === 190
			|| e.keyCode === 187) {
				e.preventDefault();
			}
    });

	// once ajax done...
  $.ajax('/Numnumbers.json').done(function(data){
		// focuses on input when document loaded (init)
		$input.focus();

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
