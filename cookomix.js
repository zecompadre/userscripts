(function () {
	'use strict';

	var button = document.createElement("button");
	button.classList.add('button-copy');
	button.setAttribute('role', 'button');
	button.innerText = 'Copiar';

	document.body.appendChild(button);

	button.onclick = function () {

		var allText = [];

		allText.push(window.location.href);
		allText.push('');

		var title = document.querySelector(".content-title .entry-title");

		allText.push(title.innerText);

		var author = document.querySelector(".content-title a");
		allText.push('Cookomix [' + author.innerText + ']');

		var sidebar = document.querySelector("#sidebar");

		var groups = sidebar.querySelectorAll(".ribbon.ingredients");

		if (groups.length > 0) {

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
			allText.push('');

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

		console.clear();

		console.log(allText.join('\n'));

		copyToCipboard(allText.join('\n'));

		return false;
	};

})();
