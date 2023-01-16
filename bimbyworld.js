(function () {
	'use strict';

	var holder = jQuery(".copy-post-url");

	var button = jQuery('<span class="copy-post-url" style="margin-left: 5px;"></span>');
	button.append('<span class="copy-post-url-button"><i class="fa fa-share"></i> Partilhar</span>');
	holder.after(button);

	button.on("click", function () {

		var title = jQuery("meta[property='og:title']").attr("content");
		var socialtocopy = jQuery('#h_socialtocopy').val().replaceAll(/\[br\]/ig, '\n');
		var link = jQuery('link[rel="canonical"').attr("href");

		var result = title + "\n\nVeja aqui: " + link + "\n.\n.\n.\n.\n." + socialtocopy + "\nVeja aqui: " + link;

		console.clear();
		console.log(result);

		copyToCipboard(result);

		return false;
	});

})();