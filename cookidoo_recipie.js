(function () {
	'use strict';

	const holder = document.querySelector(".core-nav__container .core-nav__main-links.authenticated-only");
	if (!holder) return;

	const button = document.createElement("button");
	button.classList.add('button-copy');
	button.setAttribute('role', 'button');
	button.innerText = 'Copiar';
	document.body.appendChild(button);

	button.onclick = function () {
		console.clear();
		const allText = [window.location.href, ''];

		const title = document.querySelector(".recipe-card__section.recipe-card__name");
		if (title) allText.push(title.innerText, '');

		const extractSection = (id, inner, itens, header) => {
			const section = document.getElementById(id);
			if (!section) return;

			allText.push(header, '');
			section.querySelectorAll(inner).forEach(group => {
				const groupTitle = group.querySelector("h5");
				let wrapper = group.querySelector("ul, ol");

				if (id === "tips-section") {
					wrapper = group;
				} else if (id === "also-featured-in-section") {
					wrapper = group;
				}

				if (groupTitle) allText.push(groupTitle.innerText, '');

				//console.log(header, group, wrapper, itens)

				wrapper?.querySelectorAll(itens).forEach(li => {
					let text = li.innerText.trim();
					if (id === "ingredients-section") {
						const name = li.querySelector(".recipe-ingredient__name")?.innerText.trim() || "";
						const amount = li.querySelector(".recipe-ingredient__amount")?.innerText.trim() || "";
						const description = li.querySelector(".recipe-ingredient__description")?.innerText.trim().replace(/[()]/g, "") || "";
						text = `${amount} ${name}${description ? " (" + description + ")" : ""}`;
					} else if (id === "also-featured-in-section") {
						const name = section.querySelector(".rdp-collection-tile__name")?.innerText.trim() || "";
						const countryHTML = section.querySelector(".rdp-collection-tile__info")?.innerHTML.trim() || "";
						const countryName = countryHTML.split("<br>")[1]?.trim() || "Portugal";
						text = `Cookidoo® ${countryName}: Colecção "${name}"`;
					}
					allText.push(text);
					if (id === "tips-section") {
						allText.push('');
					}
				});
				allText.push('');
			});
		};

		extractSection("ingredients-section", ".recipe-content__inner-section", "li", "Ingredientes");
		extractSection("preparation-steps-section", ".recipe-content__inner-section", "li", "Preparação");
		extractSection("tips-section", ".recipe-content__unordered-list", "li", "Dicas");
		extractSection("also-featured-in-section", "rdp-collections", "rdp-collection-tile", "Coleções");

		// const collections = document.getElementById("also-featured-in-section");
		// if (collections) {
		// 	allText.push('Coleções', '');
		// 	collections.querySelectorAll(".rdp-collection-tile__content").forEach(section => {
		// 		const name = section.querySelector(".rdp-collection-tile__name")?.innerText.trim() || "";
		// 		const countryHTML = section.querySelector(".rdp-collection-tile__info")?.innerHTML.trim() || "";
		// 		const countryName = countryHTML.split("<br>")[1]?.trim() || "Portugal";
		// 		allText.push(`Cookidoo® ${countryName}: Colecção "${name}"`);
		// 	});
		// }

		console.log(allText.join('\n'));

		copyToCipboard(allText.join('\n'));
	};
})();
