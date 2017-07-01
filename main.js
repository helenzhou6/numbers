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
		const allowedFnKeys = {
			46: 'delete',
			8: 'backspace',
			37: 'left arrow',
			38: 'up arrow',
			39: 'right arrow',
			40: 'down arrow',
			13: 'enter',
		}

		const numberKeys = {
			45: 'insert',
			48: '0',
			49: '1',
			50: '2',
			51: '3',
			52: '4',
			53: '5',
			54: '6',
			55: '7',
			56: '8',
			57: '9',
			96: 'numpad 0',
			97: 'numpad 1',
			98: 'numpad 2',
			99: 'numpad 3',
			100: 'numpad 4',
			101: 'numpad 5',
			102: 'numpad 6',
			103: 'numpad 7',
			104: 'numpad 8',
			105: 'numpad 9',
		}

		var allAllowedKeys = $.extend({}, allowedFnKeys, numberKeys);

		// ON KEYDOWN - prevention
		$input.on('keydown', function(e) {
			var inputVal = $input.val();
			// if value is 0 and backspace, then remove the 0
			if
			(inputVal === '0' && e.keyCode === 8) {

					uiUpdate('', data);
					history.pushState({}, '', '/');

					// prevents more than 4 digits being typed and other characters, but allows backspace etc.
					// and if any disallowed keys or down arrow when value is 0 is pressed, nothing happens
				}
				else if
					((inputVal.length > 3 && !(allowedFnKeys[e.keyCode]))
					|| !allAllowedKeys[e.keyCode]
					|| (inputVal === '0' && e.keyCode === 40)
					|| (inputVal === '9999' && e.keyCode === 38)
				) {
					e.preventDefault();
				}
			});

		// disable mousewheel on a input number field when in focus
		// (to prevent Cromium browsers change the value when scrolling)
		$input.on('focus', 'input[type=number]', function (e) {
			$(this).on('mousewheel.disableScroll', function (e) {
				e.preventDefault()
			})
		})
		$input.on('blur', 'input[type=number]', function (e) {
			$(this).off('mousewheel.disableScroll')
		})


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
