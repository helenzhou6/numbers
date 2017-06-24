// Required to import HTML
const fs = require('fs');
const exec = require('child_process').exec;

const cheerio = require('cheerio');
const sourceHTML = fs.readFileSync('./source.html', 'utf8');
const $ = cheerio.load(sourceHTML);

const nums = {};


$('.num').each((i, elem) => {
	let numDescription = $(elem).find('.desc')
		.html()
		.replace(/(^|\s)(\d+)/g, ' <span class="number">$2</span>')
	  	.replace(/(\d+)(^|\s)/g, '<span class="number">$1</span> ')
	  	.replace(/<font .+?>/g, '')
	  	.replace(/<\/font>/g, '');


	if (numDescription === '???') {
		numDescription = "If you know a distinctive fact about this number, please <a href='mailto:efriedma@stetson.edu'>e-mail</a> me."
	}

	// use regex to add span tags to all numbers in string?
	// numDescription.replace(/(\d+)/, '<span class="number">$1</span>');

	let numColor = $(elem).find('font').attr('color');
	if (numColor === 'darkblue') {
		numColor = 'primes';
	} else if (numColor === '99AAFF') {
		numColor = 'graphs';
	} else if (numColor === 'FF7700') {
		numColor = 'digits';
	} else if (numColor === '66CC99') {
		numColor = 'sums';
	} else if (numColor === '99FF00') {
		numColor = 'bases';
	} else if (numColor === 'brown') {
		numColor = 'combinatorics';
	} else if (numColor === 'FF6699') {
		numColor = 'powers';
	} else if (numColor === 'gold') {
		numColor = 'Fibonacci';
	} else if (numColor === 'red') {
		numColor = 'geometry';
	} else if (numColor === 'blue') {
		numColor = 'repdigits';
	} else if (numColor === 'gray') {
		numColor = 'algebra';
	} else if (numColor === 'purple') {
		numColor = 'perfect';
	} else if (numColor === 'EEEE00') {
		numColor = 'pandigital';
	} else if (numColor === 'black') {
		numColor = 'divisors';
	} else if (numColor === 'BBBB00') {
		numColor = 'games';
	} else if (numColor === '006600') {
		numColor = 'divisors';
	}
	const number = $(elem).find('font').text();

	nums[number] = {
		property: numColor,
		description: numDescription
	};



});

 fs.writeFile(__dirname + "/numbers.json", JSON.stringify(nums), function (err) {
    if (err) {
      return console.log(err);
    }

    console.log("The file was saved!");
    // console.log(errorStations);
});

console.log(
	nums
);
