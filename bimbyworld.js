(function () {
	'use strict';

	var holder = jQuery(".copy-post-url");

	var button = jQuery('<span></span>');
	button.append('<i class="fa fa-share"></i> Partilhar');
	holder.after(button);

	button.on("onclick", function () {

		var title = jQuery("meta[property='og:title']").attr("content");
		var socialtocopy = jQuery('#h_socialtocopy').val().replaceAll(/\[br\]/ig, '\n');
		var link = jQuery('link[rel="canonical"').attr("href");

		var result = title + "\nVeja aqui: " + link + "\n" + socialtocopy + "\nVeja aqui: " + link;

		console.clear();
		console.log(result);

		copyToCipboard(result);

		return false;
	});

})();