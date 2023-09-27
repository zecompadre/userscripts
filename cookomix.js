(function () {
	'use strict';
	var holder = document.querySelector(".recipe.type-recipe");
	if (holder) {
		var li = document.createElement("li");
		li.classList.add('core-nav__item');
		li.appendBefore(holder);
		holder.insertBefore(li, holder.firstChild);

		var button = document.createElement("button");
		button.innerText = 'Copiar';
		button.classList.add('button--primary');
		li.appendChild(button);

		button.onclick = function () {

			var allText = [];

			allText.push(window.location.href);
			allText.push('');

			var title = document.querySelector(".entry-title");

			console.log(title)

			allText.push(title.innerText);
			allText.push('');

			var groups = [];

			var ingredients = document.querySelector("dl.ingredients");
			if (ingredients) {
				var innerEle = ingredients.querySelectorAll("dt,dd");
				console.log(innerEle)

				/*
								allText.push('Ingredientes');
								groups.forEach(h => {
									allText.push('');
									if (h.innerText !== '') {
										allText.push(h.innerText);
									}
									var inner = h.nextElementSibling;
									inner.querySelectorAll('li').forEach(li => {
										allText.push(li.innerText);
									});
								});
				*/
			}
			/*
						var preparation = document.getElementById("preparation-steps");
						if (preparation) {
							groups = preparation.querySelectorAll("core-list-section h4,core-list-section h3");
							allText.push('');
							allText.push('Preparação');
							groups.forEach(h => {
								allText.push('');
								if (h.innerText !== 'Preparação') {
									allText.push(h.innerText);
								}
								var inner = h.nextElementSibling;
								inner.querySelectorAll('li').forEach(li => {
									allText.push(li.innerText);
								});
							});
						}
			*/
			console.clear();
			console.log(allText.join('\n'));

			copyToCipboard(allText.join('\n'));

			return false;
		};
	}
})();
