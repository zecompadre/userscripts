(function () {

	var validator = "https://wkt-playground.zecompadre.com";
	//var validator = "https://wkt-plotter.zecompadre.com";
	var fetchurl = "https://geom.fotocasa.es/v104/geom_[location].js";


	function geoJsonToWKT(geoJson) {
		if (geoJson.geometry.type === "Polygon") {
			// For Polygon, just join the coordinates in WKT format
			return "POLYGON((" + geoJson.geometry.coordinates[0].map(coord => coord.join(" ")).join(", ") + "))";
		} else if (geoJson.geometry.type === "MultiPolygon") {
			// For MultiPolygon, loop through each polygon and join coordinates in WKT format
			return "MULTIPOLYGON((" + geoJson.geometry.coordinates.map(polygon =>
				"(" + polygon[0].map(coord => coord.join(" ")).join(", ") + ")"
			).join(", ") + "))";
		} else {
			throw new Error("Unsupported geometry type: " + geoJson.geometry.type);
		}
	}


	window.addEventListener('load', function () {

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

			var location = JSON.parse(localStorage.getItem('LatestsSearches'))[0].combinedLocationIds.replace(/,/g, '_')

			var url = fetchurl.replace("[location]", location);

			var xhr = new XMLHttpRequest();

			xhr.open('GET', url, true);
			xhr.onreadystatechange = function () {
				if (xhr.readyState === XMLHttpRequest.DONE) {
					if (xhr.status === 200) {

						var jsonstr = xhr.responseText.replace(/(var(:?.*)geom_(:?.*)(?:\s)\=(?:\s))+/gm, "");

						var feature = JSON.parse(jsonstr);

						console.log("feature", feature);

						var wkt = geoJsonToWKT(feature);

						console.log("wkt", wkt);

						copyToCipboard(wkt);
						/*
												var bc = document.querySelectorAll(".breadcrumb-navigation > li > a");
												var cur = document.querySelector(".breadcrumb-navigation-current-level");

												if (bc.length === 0) {
													bc = document.querySelectorAll(".breadcrumb-geo > ul > li > a");
													cur = document.querySelector(".breadcrumb-geo > ul > li:last-child");
												}
						*/
						var text = "Zona visível";
						/*
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
						*/
						var msg = document.getElementById("map-undo-message");
						if (msg) {
							msg.remove();
						}

						let element = document.getElementById("map-shape-message");

						if (element)
							element.remove();

						msg = document.createElement("div");
						msg.id = "map-shape-message";
						msg.classList.add("map-message");
						msg.classList.add("feedback");
						msg.classList.add("contextual");
						msg.classList.add("warning");
						msg.style.width = "100%";
						msg.style.textAlign = "center";
						msg.innerHTML = "SHAPE " + titleCase(text) + ", copiada para o clipboard<br />Verificar -> <a id='shapetest' href='" + validator + "' target='_shapetest'> Shape Test!</a>";

						/*
					var close = document.createElement("a");
					close.classList.add("icon-close");
					close.classList.add("close-btn");
					close.style.cursor = "pointer";
					close.style.position = "absolute";
					close.style.right = "5px";
					close.style.top = "5px";

					close.onclick = closeMsg;

					msg.appendChild(close);
*/
						var map = document.querySelector(".re-SearchMapWrapper");
						/*
											var shapeclose = document.querySelector(".delete-cross-button.icon-close");
											if (shapeclose) {
												document.querySelector(".delete-cross-button.icon-close").onclick = closeMsg;
											}
						*/
						map.insertBefore(msg, map.firstChild);


					} else {
						console.error('Request failed with status:', xhr.status);
					}
				}
			};
			xhr.send();



			return false;
		};

		//}, 3000);
	}, false);
})();