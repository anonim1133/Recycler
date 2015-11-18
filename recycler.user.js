// ==UserScript==
// @name        Wykop Recycler
// @description Wyszukuje duplikatów obrazków na mikroblogu
// @include     http://www.wykop.pl/mikroblog/*
// @include     http://www.wykop.pl/wpis/*
// @version     0.1
// ==/UserScript==


if (typeof $ == 'undefined') {
	if (typeof unsafeWindow !== 'undefined' && unsafeWindow.jQuery) {
		// Firefox
		var $ = unsafeWindow.jQuery;
		main();
	} else {
		// Chrome
		addJQuery(main);
	}
} else {
	// Opera
	main();
}

function addJQuery(callback) {
	var script = document.createElement("script");
	script.textContent = "(" + callback.toString() + ")();";
	document.body.appendChild(script);
}

function main(){
	var div = $('#itemsStream > li > div.wblock.lcontrast.dC > div');
	div.each(function(){
		var media = $(this).find('div.text > div.media-content:not(.video)');
		var where = $(this).find('div.author a:not(.showProfileSummary):not(.button):first').attr('href');
		var name = media.find('p a:first').text();
		var original = media.find('a:first').attr('href');
		
		if(where !== undefined && name !== undefined && original !== undefined)
			$.post("http://localhost:8888/check/", {name: name, where: where, original: original}, function(data) {
				if(data.status == 'duplicate'){
					console.log('Duplicate');
					media.append(
						$('<p>').addClass('description light').text('Duplicate: ').append(
							$('<a>').attr('href', data.result[0].original).text('Original image')
						).append(
							$('<a>').attr('href', data.result[0].where).text('#')
						)
					);
				}else if(data.status == 'new'){
					console.log('New');
					$(data.result).each(function(){
						media.prepend(
							$('<p>').addClass('light').text('Similar['+this.similar+'] |').append(
								$('<a>').attr('href', this.original).text(' Image url | ')
							).append(
								$('<a>').attr('href', this.where).text(' Source url')
							)
						);
					});
				}
			});
	});
}
