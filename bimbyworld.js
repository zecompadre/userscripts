(function () {
	'use strict';

	var holder = jQuery(".post-title.entry-title");

	var button = document.createElement("button");
	button.innerText = 'Copiar';
	button.classList.add('button--primary');
	holder.appendChild(button);

	var title = holder.text();
	var socialtocopy = jQuery('#h_socialtocopy').val().replaceAll(/\[br\]/ig, '\n');
	var link = jQuery('link[rel="canonical"').attr("href");

	console.clear();
	console.log("\n\nVeja aqui: " + link + "\n\n" + socialtocopy + "\n\nVeja aqui: " + link);

	copyToCipboard("\n\nVeja aqui: " + link + "\n\n" + socialtocopy + "\n\nVeja aqui: " + link);
})();