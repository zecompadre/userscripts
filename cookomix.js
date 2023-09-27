(function () {
	'use strict';
	var holder = document.querySelector(".recipe.type-recipe");
	if (holder) {
		var buttonholder = document.querySelector("#menu-cookomix");
		var li = document.createElement("li");
		li.classList.add('menu-item');
		li.classList.add('menu-item-type-post_type');
		li.classList.add('menu-item-object-page');
		li.classList.add('menu-item-9');
		li.appendBefore(buttonholder);
		buttonholder.insertBefore(li, buttonholder.firstChild);

		var button = document.createElement("a");
		button.setAttribute("href", "javascript:void(0)");
		li.appendChild(button);

		var span = document.createElement("span");
		span.innerText = 'Copiar';
		button.appendChild(span);

		button.onclick = function () {

			var allText = [];

			allText.push(window.location.href);
			allText.push('');

			var title = document.querySelector(".entry-title");

			console.log(title)

			allText.push(title.innerText);
			allText.push('');

			var sidebar = document.querySelector("#sidebar");

			var groups = sidebar.querySelectorAll(".ribbon.ingredients");

			if (groups.length > 0) {

				console.log('groups')

				groups.forEach(g => {
					allText.push('');
					allText.push(g.innerText);

					var next = g.nextElementSibling;

					var ingredients = next.querySelectorAll('DT,DD');

					var tmpIngredient = "";
					ingredients.forEach(i => {
						if (i.tagName == "DT") {
							tmpIngredient = i.innerText;
						}
						else if (i.tagName == "DD") {
							tmpIngredient += " " + i.innerText;
							allText.push(tmpIngredient);
							tmpIngredient = '';
						}
					});
				});
			}
			else {
				console.log('no groups')

				var next = sidebar.querySelector("dl.ingredients");
				var ingredients = next.querySelectorAll('DT,DD');

				var tmpIngredient = "";
				ingredients.forEach(i => {
					if (i.tagName == "DT") {
						tmpIngredient = i.innerText;
					}
					else if (i.tagName == "DD") {
						tmpIngredient += " " + i.innerText;
						allText.push(tmpIngredient);
						tmpIngredient = '';
					}
				});
			}

			allText.push('');

			var inside = document.querySelector(".instructions.dsb-select");
			var next = inside.querySelector("ol");
			var steps = next.querySelectorAll('.step-title,li');
			if (steps.length > 0) {

				steps.forEach(s => {
					if (s.classList.contains('step-title')) {
						allText.push('');
						allText.push(s.innerText);
					}
					else {
						if (s.tagName == "LI") {
							allText.push(s.innerText);
						}
					}
				});

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
			//console.clear();
			console.log(allText.join('\n'));

			copyToCipboard(allText.join('\n'));

			return false;
		};
	}
})();
