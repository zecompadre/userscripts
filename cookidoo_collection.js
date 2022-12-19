
(function() {
    'use strict';

    var copyToCipboard = function(text)
    {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
    }

    Element.prototype.appendAfter = function (element) {
        element.parentNode.insertBefore(this, element.nextSibling);
    };

    Element.prototype.appendBefore = function (element) {
        element.parentNode.insertBefore(this, element);
    };

    var holder = document.querySelector(".l-content.l-header-offset.collection-header > .g-wrapper");

    console.log(holder);

    var button = document.createElement("span");
    button.classList.add('button');
    button.classList.add('button--primary');
    button.innerText = 'Copiar';
    button.style.textAlign = "center";
    button.style.marginBottom = "10px";
    button.style.width = "100%";

    button.appendBefore(holder);

    button.onclick = function() {

        var allText = [];
        
        allText.push(window.location.href);
        allText.push('');
        var title = document.querySelector('.collection-header__title');
        allText.push("Cookidoo®: Colecção \"" + title.innerText + "\"");
        allText.push('');
        var number = document.querySelector('.collection-header__subtitle');
        allText.push(number.innerText);
        allText.push('');
        var description = number.nextElementSibling;
        allText.push(description.innerText);
        allText.push('');
        allText.push('Lista');
        allText.push('');
        var recipies = document.querySelectorAll('core-tiles-list p.core-tile__description-text');
        recipies.forEach(li => {
            allText.push(li.innerText);
        });
        allText.push('');
        allText.push("[cookidoo url='"+window.location.href+"']");

        console.clear();

        console.log(allText.join('\n'));

        copyToCipboard(allText.join('\n'));
        return false;
    };

})();
