$(document).ready(function () {
	// VARIABLES/FUNCTIONS
	var $inputWrapper = $('.input');
	var $input = $inputWrapper.find('input');
	var $text = $('.js-text');
	var $property = $('.property');
	var $contentWrapper = $('.content-wrapper');
	var defaultDescription = 'Type a number between <span class="number">0</span> to <span class="number">9999</span>';
	var fallbackDescription = 'If you know a distinctive fact about this number, please <a href="mailto:efriedma@stetson.edu">e-mail</a> me.';

	// UPDATES UI
	var uiUpdate = function(value, data) {
		var effectiveValue = parseInt(value);

		if (value > -1) {
			// makes the shadow mirror the value
			$inputWrapper.attr('data-shadow', value);
			// updates input box value
			$input.val(value);
		}

		// removes any bolded properties
		$property.find('.is-bold').removeClass('is-bold');

		// updates the description
		var description = defaultDescription;

		if (data[effectiveValue]) {
			description = data[effectiveValue].description;
			$('.' + data[effectiveValue].property).addClass('is-bold');
		} else if (value !== ''){
				description = fallbackDescription;
		}

		$text.html(description);
	};

	var getPathNum = function() {
		return parseInt(window.location.pathname.replace(/\D/g, '').substr(0, 4));
	};

	var init = function(data) {
		// init - fade in content and focus on input
		$contentWrapper.addClass('is-visible');
		$input.focus();

		// ON URL SUBMIT deals with url inputs being funky, get the numbers or homepage
		var urlValue = getPathNum();

		if (urlValue || urlValue === 0){
			uiUpdate(urlValue, data);
			history.pushState(urlValue, null, urlValue);
		} else {
			history.pushState({}, '', '/');
		}

		// Up/down etc
		var allowedFnKeys = [46, 8, 37, 39, 38, 40, 13];
		// allowed keys e.g. down arrow etc
		var numberKeys = [45, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
		var allAllowedKeys = [].concat(allowedFnKeys, numberKeys);

		// ON KEYDOWN - prevention
		$input.on('keydown', function(e) {
			var inputVal = $input.val();

			// if value is 0 and backspace, then remove the 0
			if (urlValue === '0' && e.keyCode === 8) {
				uiUpdate('', data);
				history.pushState({}, '', '/');
				// prevents more than 4 digits being typed and other characters, but allows backspace etc.
				// and if any disallowed keys or down arrow when value is 0 is pressed, nothing happens
			} else if (
				(inputVal.length > 3 && allowedFnKeys.indexOf(e.keyCode) == -1)
				|| allAllowedKeys.indexOf(e.keyCode) == -1
				|| (inputVal === '0' && e.keyCode === 40)
			) {
				e.preventDefault();
			}
		});

		// ON INPUT in input field, updates UI and URL
    $input.on('input', function(e) {
			e.preventDefault();
			// this removes being able to down arrow to negative numbers, with lowest no being 0
			// also evaluates 000 to 0 and 099 to 99 in UI
			var inputVal = '';
			if ($(this).val() != ''){
				var inputVal = Math.abs($(this).val());
				history.pushState(inputVal, null, inputVal);
			} else {
				history.pushState({}, '', '/');
			}
			uiUpdate(inputVal, data);
    });

		// ON POPSTATE - if back or forward history button, updates UI
		window.addEventListener('popstate', function(e) {
			e.preventDefault();
			uiUpdate(getPathNum(), data);
		});
	};

	// once ajax done...
	$.ajax('Numnumbers.json').done(function(data){
		init(data);
  });

});
