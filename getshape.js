(function () {

	//var validator = "https://wkt-playground.zecompadre.com";
	var validator = "https://wkt-plotter.zecompadre.com";

	window.addEventListener('load', function () {
		//setTimeout(function() {
		var closeMsg = function (e) {
			var msg = document.getElementById("map-shape-message");
			if (msg) {
				msg.remove();
			}
			msg = document.getElementById("map-undo-message");
			if (msg) {
				msg.remove();
			}
			return false;
		};

		var button = document.createElement("button");
		button.classList.add('button-copy');
		button.setAttribute('role', 'button');

		var icon = document.createElement("span");
		icon.classList.add('icon-draw');
		button.appendChild(icon);

		var text = document.createElement("span");
		text.classList.add('icon-text');
		text.innerText = 'Copiar Shape';
		button.appendChild(text);

		document.body.appendChild(button);

		button.onclick = function (e) {

			closeMsg();

			var data = [];
			var shapeType = "POLYGON((###))";
			window.DrawManager.getCollection().forEach(collection => {
				var polygons = collection.latLngs.getArray().reduce((accumulator_out, currentvalue_out, v) => {
					var data = currentvalue_out.getArray().reduce((accumulator_in, currentvalue_in, u) => {
						accumulator_in.push(currentvalue_in.lng() + " " + currentvalue_in.lat());
						return accumulator_in;
					}, []);

					if (data[0] !== data[data.length - 1]) {
						console.log("must close");
						data.push(data[0]);
					}
					else { console.log("already closed"); }

					accumulator_out.push(data);

					return accumulator_out;
				}, []);

				polygons.forEach(polygon => {
					data.push(polygon.join(","));
				});

			});

			if (data.length > 1) {
				shapeType = "MULTIPOLYGON(((###)))";
			}

			copyToCipboard(shapeType.replace("###", data.join("),(")));

			var bc = document.querySelectorAll(".breadcrumb-navigation > li > a");
			var cur = document.querySelector(".breadcrumb-navigation-current-level");

			if (bc.length === 0) {
				bc = document.querySelectorAll(".breadcrumb-geo > ul > li > a");
				cur = document.querySelector(".breadcrumb-geo > ul > li:last-child");
			}

			var text = "Zona visível";
			if (bc) {
				var bcText = [];
				bc.forEach(a => {
					bcText.push(a.innerText);
				});
				if (cur) {
					bcText.push(cur.innerText);
				}
				if (bcText.length > 0) {
					text = bcText.join(", ");
				}
			}

			var msg = document.getElementById("map-undo-message");
			if (msg) {
				msg.remove();
			}

			msg = document.createElement("div");
			msg.id = "map-shape-message";
			msg.classList.add("map-message");
			msg.classList.add("feedback");
			msg.classList.add("contextual");
			msg.classList.add("warning");
			msg.style.width = "100%";
			msg.style.textAlign = "center";
			msg.innerHTML = "SHAPE " + titleCase(text) + ", copiada para o clipboard<br />Verificar -> <a id='shapetest' href='" + validator + "' target='_shapetest'> Shape Test!</a>";

			var close = document.createElement("a");
			close.classList.add("icon-close");
			close.classList.add("close-btn");
			close.style.cursor = "pointer";
			close.style.position = "absolute";
			close.style.right = "5px";
			close.style.top = "5px";

			close.onclick = closeMsg;

			msg.appendChild(close);

			var map = document.getElementById("map-placeholder");

			var shapeclose = document.querySelector(".delete-cross-button.icon-close");
			if (shapeclose) {
				document.querySelector(".delete-cross-button.icon-close").onclick = closeMsg;
			}

			map.insertBefore(msg, map.firstChild);

			return false;
		};

		//}, 3000);
	}, false);
})();
