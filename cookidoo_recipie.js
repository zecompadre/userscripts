
(function() {
    'use strict';

    var holder = document.getElementById("recipe-card");

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
        var i_groups = ingredients.querySelectorAll("core-list-section h4");
        allText.push('Ingredientes');
        i_groups.forEach(h => {
            allText.push('');
            if(h.innerText !== '')
            {
                allText.push(h.innerText);
            }
            var g_ingredients = h.nextElementSibling;
            g_ingredients.querySelectorAll('li').forEach(li => {
                allText.push(li.innerText);
            });
        });

        var preparation = document.getElementById("preparation-steps");
        var p_groups = preparation.querySelectorAll("core-list-section h4,core-list-section h3");
        allText.push('');
        allText.push('Preparação');
        p_groups.forEach(h=> {
            allText.push('');
            if(h.innerText !== 'Preparação')
            {
                allText.push(h.innerText);
            }
            var g_ingredients =h.nextElementSibling;
            g_ingredients.querySelectorAll('li').forEach(li => {
                allText.push(decodeURIComponent(li.innerText));
            });
        });

        var tips = document.getElementById("hints-and-tricks");
        if(tips){
            var t_groups = tips.querySelectorAll("h3");
            allText.push('');
            t_groups.forEach(h => {
                allText.push(h.innerText);
                var g_ingredients = h.nextElementSibling;
                g_ingredients.querySelectorAll('li').forEach(li => {
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
