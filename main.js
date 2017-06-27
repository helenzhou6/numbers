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

	}

	// UI
	// on keydown, prevents more than 4 digits being typed and other characters
	$input.on('keydown', function(e) {
		var allowedKeys = [46, 8, 13, 37, 39, 38, 40, 45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
			if (window.location.pathname.substring(1) === '0'
			&& e.keyCode === 8
			) {
				$input.val('');
				shadow('');
				$('.property').find('.is-bold').removeClass('is-bold');
				$text.html('Type a number between <span class="number">0</span> to <span class="number">9999</span>');
				history.pushState({}, "", '/');
			} else if ($(this).val().length > 3
			&& e.keyCode != 46
			&& e.keyCode != 8
			&& e.keyCode != 37
			&& e.keyCode != 39
			|| (allowedKeys.indexOf(e.keyCode) == -1)
			|| window.location.pathname.substring(1) === '0'
			&& e.keyCode === 40) {
							e.preventDefault();
				}
		});
	// once ajax done...
  $.ajax('/Numnumbers.json').done(function(data){


		// focuses on input when document loaded (init)
		$input.focus();

		var urlValue = parseInt(window.location.pathname.replace(/\D/g, '').substr(0, 4));
		if (urlValue || urlValue === 0){
			$input.val(urlValue);
			shadow(urlValue);
			descripUpdate(urlValue, data);
			history.pushState(urlValue, null, urlValue);
		} else {
			history.pushState({}, "", '/');
		}

		// on input in input field, updates shadow and description/property, adds to history/url
    $input.on('input', function(e) {
			e.preventDefault();
			// this removes the being able to down arrow to negative numbers, but between 0 and 1
			// also evaluates 000 to 0 and 099 to 99 in UI
			var inputVal = '';
			if ($(this).val() != ''){
				var inputVal = Math.abs($(this).val());
			}
			$(this).val(inputVal);
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
