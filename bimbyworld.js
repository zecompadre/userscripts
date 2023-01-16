(function () {
	'use strict';

	var holder = jQuery("h1.post-title.entry-title");

	var button = jQuery('<span class="simplefavorite-button  shareit-post-url-button" style="box-shadow:none;-webkit-box-shadow:none;-moz-box-shadow:none;"><i class="fas fa-heart" style="color: rgb(0, 0, 0);"></i> Partilhar</span>');
	holder.append(button);

	button.on("onclick", function () {

		var title = document.querySelector("meta[property='og:title']").getAttribute("content");
		var socialtocopy = jQuery('#h_socialtocopy').val().replaceAll(/\[br\]/ig, '\n');
		var link = jQuery('link[rel="canonical"').attr("href");

		var result = title + "\nVeja aqui: " + link + "\n" + socialtocopy + "\nVeja aqui: " + link;

		console.clear();
		console.log(result);

		copyToCipboard(result);

		return false;
	});

})();