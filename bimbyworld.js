(function() {
    'use strict';

    var title = jQuery(this).text();
    var socialtocopy = jQuery('#h_socialtocopy').val().replaceAll(/\[br\]/ig, '\n');
    var link = jQuery('link[rel="canonical"').attr("href");

    console.clear();
    console.log("\n\nVeja aqui: " + link + "\n\n" + socialtocopy + "\n\nVeja aqui: " + link);

    copyToCipboard("\n\nVeja aqui: " + link + "\n\n" + socialtocopy + "\n\nVeja aqui: " + link);
})();