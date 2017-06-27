$(document).ready(function () {

	// VARIABLES/FUNCTIONS
	var $inputWrapper = $('.input');
	var $input = $inputWrapper.find('input');
	var $text = $('.js-text');

	// UPDATES UI
	var UIUpdate = function(value, data) {
		var effectiveValue = parseInt(value);

		$inputWrapper.attr('data-shadow', '');
		$input.val('');

		if (value > -1) {
			// makes the shadow mirror the value
			$inputWrapper.attr('data-shadow', value);
			// updates input box value
			$input.val(value);
		}

		// removes any bolded properties
		$('.property').find('.is-bold').removeClass('is-bold');

		// updates the description
		var description = "If you know a distinctive fact about this number, please <a href='mailto:efriedma@stetson.edu'>e-mail</a> me.";
		if (data[effectiveValue]) {
			description = data[effectiveValue].description;
			$('.' + data[effectiveValue].property).addClass('is-bold');
		} else if (value === ''){
				description = 'Type a number between <span class="number">0</span> to <span class="number">9999</span>';
		}
		$text.html(description);
	}

	// once ajax done...
  $.ajax('Numnumbers.json').done(function(data){

		// init - fade in content and focus on input
		$('.content-wrapper').addClass('is-visible');
		$input.focus();

		// ON KEYDOWN - prevention
		$input.on('keydown', function(e) {
				var urlValue = window.location.pathname.substring(1);
				// allowed keys e.g. down arrow etc
				var allowedKeys = [46, 8, 13, 37, 39, 38, 40, 45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];

				// if value is 0 and backspace, then remove the 0
				if (urlValue === '0'
				&& e.keyCode === 8
				) {
					UIUpdate('', data);
					history.pushState({}, "", '/');
				// prevents more than 4 digits being typed and other characters, but allows backspace etc.
				// and if any disallowed keys or down arrow when value is 0 is pressed, nothing happens
				} else if ($(this).val().length > 3
				&& e.keyCode != 46
				&& e.keyCode != 8
				&& e.keyCode != 37
				&& e.keyCode != 39
				|| (allowedKeys.indexOf(e.keyCode) == -1)
				|| urlValue === '0'
				&& e.keyCode === 40) {
						e.preventDefault();
					}
			});

		// ON URL SUBMIT deals with url inputs being funky, get the numbers or homepage
		var urlValue = parseInt(window.location.pathname.replace(/\D/g, '').substr(0, 4));
		if (urlValue || urlValue === 0){
			UIUpdate(urlValue, data);
			history.pushState(urlValue, null, urlValue);
		} else {
			history.pushState({}, "", '/');
		}

		// ON INPUT in input field, updates UI and URL
    $input.on('input', function(e) {
			var urlValue = window.location.pathname.substring(1);
			e.preventDefault();
			// this removes being able to down arrow to negative numbers, with lowest no being 0
			// also evaluates 000 to 0 and 099 to 99 in UI
			var inputVal = '';
			if ($(this).val() != ''){
				var inputVal = Math.abs($(this).val());
				history.pushState(inputVal, null, inputVal);
			} else {
				history.pushState({}, "", '/');
			}
			UIUpdate(inputVal, data);
    });

		// ON POPSTATE - if back or forward history button, updates UI
		window.addEventListener('popstate', function(e) {
			var urlValue = parseInt(window.location.pathname.replace(/\D/g, '').substr(0, 4));
			e.preventDefault();
			UIUpdate(urlValue, data);
		});
  });

});
