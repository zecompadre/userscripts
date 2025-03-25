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

			var title = document.querySelector('.cdp-header__wrapper .cdp-header__title');
			allText.push("Cookidoo®: Colecção \"" + title.innerText + "\"");
			allText.push('');
			var number = document.querySelector('.cdp-header__count');
			allText.push(number.innerText);
			allText.push('');
			var description = document.querySelector('.cdp-header__text');
			allText.push(description.innerText);
			allText.push('');
			allText.push('Lista');
			allText.push('');
			var recipies = document.querySelectorAll('.core-tile--expanded .core-tile__description');
			recipies.forEach(li => {
				allText.push(li.innerText);
			});
			allText.push('');
			allText.push("[cookidoo url='" + window.location.href + "']");

			console.clear();

			console.log(allText.join('\n'));

			copyToCipboard(allText.join('\n'));
			return false;
		};
	}
})();
