(function () {

	var validator = "https://wkt-playground.zecompadre.com";
	//var validator = "https://wkt-plotter.zecompadre.com";
	var fetchurl = "https://geom.fotocasa.es/v104/geom_[location].js";


	function geojsonToWKT(geojson) {
		const geometryTypes = {
			Point: 'POINT',
			MultiPoint: 'MULTIPONT',
			LineString: 'LINESTRING',
			MultiLineString: 'MULTILINESTRING',
			Polygon: 'POLYGON',
			MultiPolygon: 'MULTIPOLYGON'
		};

		function convertCoordinates(coords) {
			return coords.map(coord => coord.join(' ')).join(', ');
		}

		function convertGeometry(geometry) {
			const {
				type,
				coordinates
			} = geometry;

			switch (type) {
				case 'Point':
					return `${geometryTypes[type]} (${convertCoordinates(coordinates)})`;
				case 'MultiPoint':
					return `${geometryTypes[type]} (${coordinates.map(convertCoordinates).join(', ')})`;
				case 'LineString':
					return `${geometryTypes[type]} (${convertCoordinates(coordinates)})`;
				case 'MultiLineString':
					return `${geometryTypes[type]} (${coordinates.map(convertCoordinates).join(', ')})`;
				case 'Polygon':
					return `${geometryTypes[type]} (${coordinates.map(convertCoordinates).join(', ')})`;
				case 'MultiPolygon':
					return `${geometryTypes[type]} (${coordinates.map(convertCoordinates).join(', ')})`;
				default:
					throw new Error(`Unsupported geometry type: ${type}`);
			}
		}

		const {
			type,
			coordinates
		} = geojson.geometry;

		if (!geometryTypes[type]) {
			throw new Error(`Unsupported geometry type: ${type}`);
		}

		return convertGeometry(geometry);
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

						console.log("jsonstr", jsonstr);

						var feature = JSON.parse(jsonstr);

						console.log("feature", feature);

						var wkt = geojsonToWKT(feature);

						console.log("wkt", wkt);

						copyToCipboard(wkt);

						var msg = document.getElementById("map-undo-message");
						if (msg)
							msg.remove();

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
						msg.innerHTML = "SHAPE Zona visível, copiada para o clipboard<br />Verificar -> <a id='shapetest' href='" + validator + "' target='_shapetest'> Shape Test!</a>";

						var map = document.querySelector(".re-SearchMapWrapper");

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