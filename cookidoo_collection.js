
(function() {
    'use strict';

    var holder = document.querySelector(".core-nav__container .core-nav__main-links.authenticated-only");
    if(holder)
    {
        var li = document.createElement("li");
        li.classList.add('core-nav__item');
        li.appendBefore(holder);
        holder.insertBefore(li, holder.firstChild);

        var button = document.createElement("button");
        button.innerText = 'Copiar';
        buttonclassList.add('button--primary');
        li.appendChild(button);

        a.onclick = function() {

            var allText = [];

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
    }
})();
