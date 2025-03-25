(function () {
	'use strict';
	var holder = document.querySelector(".core-nav__container .core-nav__main-links.authenticated-only");
	if (holder) {

		var button = document.createElement("button");
		button.classList.add('button-copy');
		button.setAttribute('role', 'button');
		button.innerText = 'Copiar';

		document.body.appendChild(button);

		button.onclick = function () {

			var allText = [];

			allText.push(window.location.href);
			allText.push('');

			var title = document.querySelector(".recipe-card__section.recipe-card__name");
			allText.push(title.innerText);
			allText.push('');

			var groups = [];

			var ingredients = document.getElementById("ingredients-section");
			if (ingredients) {
				let groups = ingredients.querySelectorAll(".recipe-content__inner-section h5");
				allText.push('Ingredientes');
				groups.forEach(h => {
					let sectionTitle = h.innerText.trim();
					let inner = h.nextElementSibling;
					let items = inner.querySelectorAll('li');

					items.forEach((li, index) => {
						if (index === 0 && sectionTitle) {
							allText.push(`${sectionTitle} ${li.innerText}`);
						} else {
							allText.push(li.innerText);
						}
					});
				});

				console.log(allText.join('\n'));
			}

			// var ingredients = document.getElementById("ingredients-section");
			// if (ingredients) {
			// 	groups = ingredients.querySelectorAll(".recipe-content__inner-section h5");

			// 	groups.forEach(h => {
			// 		allText.push('');
			// 		if (h.innerText !== '') {
			// 			allText.push(h.innerText);
			// 		}
			// 		var inner = h.nextElementSibling;
			// 		inner.querySelectorAll('li').forEach(li => {
			// 			allText.push(li.innerText);
			// 		});
			// 	});
			// }

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

			var tips = document.getElementById("hints-and-tricks");
			if (tips) {
				groups = tips.querySelectorAll("h3");
				allText.push('');
				groups.forEach(h => {
					allText.push(h.innerText);
					var inner = h.nextElementSibling;
					inner.querySelectorAll('li').forEach(li => {
						allText.push(li.innerText);
					});
				});
			}

			var collections = document.getElementById("in-collections");
			if (collections) {
				groups = collections.querySelectorAll("h3");
				allText.push('');
				groups.forEach(h => {
					allText.push(h.innerText);
					var inner = h.nextElementSibling;
					inner.querySelectorAll('li').forEach(li => {
						//Cookidoo® Itália: Colecção "Dolci americani"
						var name = li.querySelector("div");
						var country = name.querySelector("span");
						if (country) {
							var countryName = country.innerText.split(",")[1].trim();
							country.remove();
						}
						else
							countryName = "Portugal"
						allText.push("Cookidoo® " + countryName + ": Colecção \"" + name.innerText + "\"");
					});
				});
			}

			console.clear();
			console.log(allText.join('\n'));

			copyToCipboard(allText.join('\n'));

			return false;
		};
	}
})();
