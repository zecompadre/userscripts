(function () {
	'use strict';

	const button = document.createElement("button");
	button.classList.add('button-copy');
	button.setAttribute('role', 'button');
	button.innerText = 'Copiar';
	document.body.appendChild(button);

	button.onclick = function () {
		console.clear();
		const allText = [window.location.href, ''];

		const title = document.querySelector(".content-title .entry-title");
		if (title) allText.push(title.innerText);

		const author = document.querySelector(".content-title a");
		if (author) allText.push(`Cookomix [${author.innerText}]`);

		const sidebar = document.querySelector("#sidebar");
		const groups = sidebar?.querySelectorAll(".ribbon.ingredients") || [];

		const extractIngredients = (container) => {
			if (!container) return;
			let tmpIngredient = "";
			container.querySelectorAll("DT,DD").forEach(i => {
				if (i.tagName === "DT") {
					tmpIngredient = i.innerText;
				} else if (i.tagName === "DD") {
					allText.push(`${tmpIngredient} ${i.innerText}`);
					tmpIngredient = '';
				}
			});
		};

		if (groups.length > 0) {
			groups.forEach(g => {
				allText.push('', g.innerText);
				extractIngredients(g.nextElementSibling);
			});
		} else {
			allText.push('');
			extractIngredients(sidebar?.querySelector("dl.ingredients"));
		}

		allText.push('');

		const inside = document.querySelector(".instructions.dsb-select");
		inside?.querySelectorAll(".step-title,li").forEach(s => {
			if (s.classList.contains("step-title")) {
				allText.push('', s.innerText);
			} else if (s.tagName === "LI") {
				allText.push(s.innerText);
			}
		});

		console.log(allText.join('\n'));
		copyToCipboard(allText.join('\n'));
	};
})();