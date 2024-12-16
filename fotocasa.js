(function () {

	var validator = "https://wkt-playground.zecompadre.com";
	//var validator = "https://wkt-plotter.zecompadre.com";
	var fetchurl = "https://geom.fotocasa.es/v104/geom_[location].js";


	function geojsonToWKT(geojson) {

		var val = geojson; // Your GeoJSON goes here
		var wkt_options = {};
		var geojson_format = new OpenLayers.Format.GeoJSON();
		var testFeatures = geojson_format.read(val); // Read GeoJSON

		// Function to handle GeometryCollection
		function flattenGeometry(feature) {
			if (feature.geometry.CLASS_NAME === 'OpenLayers.Geometry.Collection') {
				// Flatten the GeometryCollection into its components
				return feature.geometry.components.map(function (component) {
					return new OpenLayers.Feature.Vector(component);
				});
			}
			return [feature]; // Return the feature as-is if not a GeometryCollection
		}

		// Flatten GeometryCollections
		var flattenedFeatures = [];
		testFeatures.forEach(function (feature) {
			flattenedFeatures = flattenedFeatures.concat(flattenGeometry(feature));
		});

		var wkt = new OpenLayers.Format.WKT(wkt_options);
		var out = flattenedFeatures.map(function (feature) {
			return wkt.write(feature); // Write each feature to WKT
		}).join('\n'); // Join multiple WKT strings if needed

		return out;

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
			if (!geometry || !geometry.type || !geometry.coordinates) {
				throw new Error('Invalid geometry object');
			}

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
					return `${geometryTypes[type]} (${convertCoordinates(coordinates)})`;
				case 'MultiPolygon':
					let wkt = geometryTypes[type] + ' (';
					coordinates.forEach(ring => {
						wkt += '(' + convertCoordinates(ring) + '), ';
					});
					// Remove trailing comma and space
					return wkt.slice(0, -2) + ')';
				default:
					throw new Error(`Unsupported geometry type: ${type}`);
			}
		}

		if (!geojson.geometry) {
			throw new Error('Geometry not found in GeoJSON');
		}

		return convertGeometry(geojson.geometry);




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