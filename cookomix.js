(function () {
	'use strict';

	var button = document.createElement("button");
	button.classList.add('button-82-pushable');

	var span_shadow = document.createElement("span");
	span_shadow.classList.add('button-82-shadow');
	button.appendChild(span_shadow);
	var span_edge = document.createElement("span");
	span_edge.classList.add('button-82-edge');
	button.appendChild(span_edge);
	var span_front = document.createElement("span");
	span_front.classList.add('button-82-front');
	span_front.classList.add('text');
	span_front.innerText = 'Copiar';
	button.appendChild(span_front);

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
