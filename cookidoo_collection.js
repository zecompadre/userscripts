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
		const allText = [];

		const title = document.querySelector('.cdp-header__wrapper .cdp-header__title');
		const number = document.querySelector('.cdp-header__count');
		const description = document.querySelector('.cdp-header__text');
		const recipes = document.querySelectorAll('.core-tile--expanded .core-tile__description');

		if (title) allText.push(`Cookidoo®: Colecção "${title.innerText}"`, '');
		if (number) allText.push(number.innerText, '');
		if (description) allText.push(description.innerText, '');

		allText.push('Lista', '');
		recipes.forEach(li => allText.push(li.innerText));
		allText.push('', `[cookidoo url='${window.location.href}']`);

		console.log(allText.join('\n'));
		copyToCipboard(allText.join('\n'));
	};
})();
