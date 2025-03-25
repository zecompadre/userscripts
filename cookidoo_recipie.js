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
			console.clear();
			var allText = [];

			allText.push(window.location.href);
			allText.push('');

			var title = document.querySelector(".recipe-card__section.recipe-card__name");
			allText.push(title.innerText);
			allText.push('');

			var groups = [];

			var ingredients = document.getElementById("ingredients-section");
			if (ingredients) {

				allText.push('Ingredientes');

				groups = ingredients.querySelectorAll(".recipe-content__inner-section");

				groups.forEach(section => {
					allText.push('');
					var group = section.querySelector("h5");
					var wrapper = section.querySelector("ul");
					if (group) {
						allText.push(group.innerText);
						allText.push('');
					}

					let items = wrapper.querySelectorAll("li");

					items.forEach(li => {

						let name = li.querySelector(".recipe-ingredient__name")?.innerText.trim() || "";
						let amount = li.querySelector(".recipe-ingredient__amount")?.innerText.trim() || "";
						let description = li.querySelector(".recipe-ingredient__description")?.innerText.trim() || "";
						description = description.replace("(", "").replace(")", "");

						let formattedIngredient = `${amount} ${name}${description ? " (" + description + ")" : ""}`;
						allText.push(formattedIngredient);
					});
				});

				allText.push('');
			}

			var preparations = document.getElementById("preparation-steps-section");
			if (preparations) {

				allText.push('Preparação');

				groups = preparations.querySelectorAll(".recipe-content__inner-section");

				groups.forEach(section => {
					allText.push('');
					var group = section.querySelector("h5");
					var wrapper = section.querySelector("ol");
					if (group) {
						allText.push(group.innerText);
						allText.push('');
					}

					let items = wrapper.querySelectorAll("li");

					items.forEach(li => {

						let preparation = li.innerText.trim();
						allText.push(preparation);
					});
				});

				allText.push('');
			}

			var tips = document.getElementById("tips-section");
			if (tips) {

				allText.push('Dicas');
				allText.push('');

				var wrapper = tips.querySelector("ul");

				let items = wrapper.querySelectorAll("li");

				items.forEach(li => {

					let tip = li.innerText.trim();
					allText.push(tip);
				});

				allText.push('');
			}

			var collections = document.getElementById("also-featured-in-section");
			if (collections) {

				allText.push('Coleções');
				allText.push('');
				groups = collections.querySelectorAll(".rdp-collection-tile__content");

				groups.forEach(section => {

					let name = section.querySelector(".rdp-collection-tile__name")?.innerText.trim() || "";
					let country = section.querySelector(".recipe-rdp-collection-tile__info")?.innerText.trim() || "";

					console.log("country", country)

					var countryName = "Portugal";
					if (country) {

						var countryName = country.split("<br>")[1].trim();
					}

					allText.push("Cookidoo® " + countryName + ": Colecção \"" + name + "\"");
				});
			}

			console.log(allText.join('\n'));

			copyToCipboard(allText.join('\n'));

			return false;
		}
	};

})();
