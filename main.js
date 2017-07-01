$(document).ready(function () {
	// VARIABLES/FUNCTIONS
	var $inputWrapper = $('.input');
	var $input = $inputWrapper.find('input');
	var $text = $('.js-text');
	var $property = $('.property');
	var $contentWrapper = $('.content-wrapper');
	var defaultDescription = 'Type a number between <span class="number">0</span> to <span class="number">9999</span>';
	var fallbackDescription = 'If you know a distinctive fact about this number, please <a href="mailto:efriedma@stetson.edu">e-mail</a> me.';

	// UPDATES description, shadow and property
	var uiUpdate = function(value, data) {
		// removes any bolded properties
		$property.find('.is-bold').removeClass('is-bold');

		// updates the description to default
		var description = defaultDescription;

		if ($input.val() !== value.toString()) {
			// updates input box value
			$input.val(value);
		}

		// makes the shadow mirror the value
		$inputWrapper.attr('data-shadow', value);

		if (value > -1 && data[value]) {
				description = data[value].description;
				$('.' + data[value].property).addClass('is-bold');
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
			history.pushState(urlValue, null, urlValue);
		} else {
			urlValue = '';
			history.pushState({}, '', '/');
		}

		uiUpdate(urlValue, data);

		// Up/down etc
		var allowedFnKeys = {
			46: 'delete',
			8: 'backspace',
			37: 'left arrow',
			38: 'up arrow',
			39: 'right arrow',
			40: 'down arrow',
			13: 'enter',
		}

		var numberKeys = {
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

			// prevents more than 4 digits being typed and other characters, but allows backspace etc.
			// and if any disallowed keys or down arrow when value is 0 is pressed, nothing happens
			if (inputVal.length > 3 && !(allowedFnKeys[e.keyCode])
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
			var inputtedVal = $(this).val();

			// also evaluates 000 to 0 and 099 to 99 in UI
			// this removes being able to down arrow to negative numbers, with lowest no being 0
			var inputVal = '';

			if (inputtedVal != ''){
				inputVal = Math.abs(inputtedVal);
				history.pushState(inputVal, null, inputVal);
			} else {
				history.pushState({}, '', '/');
			}
			uiUpdate(inputVal, data);
    });

		// ON POPSTATE - if back or forward history button, updates UI
		window.addEventListener('popstate', function(e) {
			e.preventDefault();
			var value = getPathNum();
			uiUpdate(value, data);
			history.replaceState(value, null, value);
		});
	};

	// once ajax done...
	$.ajax('Numnumbers.json').done(function(data){
		init(data);
  });

});
