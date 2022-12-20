
(function() {
    'use strict';

    var holder = document.querySelector(".l-tile");
    holder.style.marginTop = "0";
    
    document.querySelector(".l-header-offset-small").style.marginTop = "5.5rem";

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

        var title = document.querySelector(".recipe-card__title");
        allText.push(title.innerText);
        allText.push('');

        var ingredients = document.getElementById("ingredients");
        if(ingredients) {
            var groups = ingredients.querySelectorAll("core-list-section h4");
            allText.push('Ingredientes');
            groups.forEach(h => {
                allText.push('');
                if(h.innerText !== '')
                {
                    allText.push(h.innerText);
                }
                var inner = h.nextElementSibling;
                inner.querySelectorAll('li').forEach(li => {
                    allText.push(li.innerText);
                });
            });
        }

        var preparation = document.getElementById("preparation-steps");
        if(preparation) {
            var groups = preparation.querySelectorAll("core-list-section h4,core-list-section h3");
            allText.push('');
            allText.push('Preparação');
            groups.forEach(h=> {
                allText.push('');
                if(h.innerText !== 'Preparação')
                {
                    allText.push(h.innerText);
                }
                var inner =h.nextElementSibling;
                inner.querySelectorAll('li').forEach(li => {
                    allText.push(decodeURIComponent(li.innerText));
                });
            });
        }
        
        var tips = document.getElementById("hints-and-tricks");
        if(tips){
            var groups = tips.querySelectorAll("h3");
            allText.push('');
            groups.forEach(h => {
                allText.push(h.innerText);
                var inner = h.nextElementSibling;
                inner.querySelectorAll('li').forEach(li => {
                    allText.push(decodeURIComponent(li.innerText));
                });
            });
        }
        
        var collections = document.getElementById("in-collections");
        if(collections){
            var groups = collections.querySelectorAll("h3");
            allText.push('');
            groups.forEach(h => {
                allText.push(h.innerText);
                var inner = h.nextElementSibling;
                inner.querySelectorAll('li').forEach(li => {
                    allText.push(decodeURIComponent(li.innerText));
                });
            });
        }
        

        console.clear();

        console.log(allText.join('\n'));

        copyToCipboard(allText.join('\n'));

        return false;
    };

})();
