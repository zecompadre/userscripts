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

		const container = document.createElement('div');
		container.classList.add('fc-Save-search');

		container.innerHTML = `<button id="btn-copy" aria-label="Copiar Shape" class="sui-AtomButton sui-AtomButton--primary sui-AtomButton--solid sui-AtomButton--center sui-AtomButton--fullWidth" style="padding: 0;">
      <span class="sui-AtomButton-inner">
        <span class="sui-AtomButton-leftIcon">
          <div class="bell-animation">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width: 1.5em; height: 1.5em;">
              <!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path d="M96 151.4l0 209.1c9.7 5.6 17.8 13.7 23.4 23.4l209.1 0c0-.1 .1-.2 .1-.3l-4.5-7.9-32-56s0 0 0 0c-1.4 .1-2.8 .1-4.2 .1c-35.3 0-64-28.7-64-64s28.7-64 64-64c1.4 0 2.8 0 4.2 .1c0 0 0 0 0 0l32-56 4.5-7.9-.1-.3-209.1 0c-5.6 9.7-13.7 17.8-23.4 23.4zM384.3 352c35.2 .2 63.7 28.7 63.7 64c0 35.3-28.7 64-64 64c-23.7 0-44.4-12.9-55.4-32l-209.1 0c-11.1 19.1-31.7 32-55.4 32c-35.3 0-64-28.7-64-64c0-23.7 12.9-44.4 32-55.4l0-209.1C12.9 140.4 0 119.7 0 96C0 60.7 28.7 32 64 32c23.7 0 44.4 12.9 55.4 32l209.1 0c11.1-19.1 31.7-32 55.4-32c35.3 0 64 28.7 64 64c0 35.3-28.5 63.8-63.7 64l-4.5 7.9-32 56-2.3 4c4.2 8.5 6.5 18 6.5 28.1s-2.3 19.6-6.5 28.1l2.3 4 32 56 4.5 7.9z"/>
            </svg>
          </div>
        </span>
        <span class="sui-AtomButton-content">
          <span>Copiar Shape</span>
        </span>
      </span>
    </button>`;

		const targetDiv = document.querySelector('.fc-Save-search'); // Replace '.existing-div' with the selector for your target div

		targetDiv.insertAdjacentElement('afterend', container.firstElementChild);

		var button = document.getElementById("btn-copy");

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
						msg.style.width = "100%";
						msg.style.textAlign = "center";
						msg.style.backgroundColor = "var(--c-secondary-dark-2)";
						msg.style.color = "#fff";

						msg.innerHTML = "SHAPE Zona visível, copiada para o clipboard<br />Verificar -> <a id='shapetest' href='" + validator + "' target='_shapetest' style='color: #fff; text-decoration: none; font-weight: 600;'> Shape Test!</a>";

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