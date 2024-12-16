(function () {

	var validator = "https://wkt-playground.zecompadre.com";
	//var validator = "https://wkt-plotter.zecompadre.com";
	var fetchurl = "https://geom.fotocasa.es/v104/geom_";

	function geojsonToWKT(geojson) {
		let wkt = '';

		if (geojson.type === 'FeatureCollection') {
			// Handle FeatureCollection by processing each feature
			wkt = geojson.features.map(feature => geojsonToWKT(feature)).join(',');
		} else if (geojson.type === 'Feature') {
			// Handle individual Feature geometry
			wkt = geojsonToWKT(geojson.geometry);
		} else if (geojson.type === 'Polygon') {
			// Handle Polygon geometry
			wkt = 'POLYGON((';
			geojson.coordinates.forEach((ring, index) => {
				if (index > 0) wkt += ', ';
				wkt += ring.map(coord => `${coord[0]} ${coord[1]}`).join(', ');
			});
			wkt += '))';
		} else if (geojson.type === 'MultiPolygon') {
			// Handle MultiPolygon geometry
			wkt = 'MULTIPOLYGON(';
			wkt += geojson.coordinates.map(polygon => {
				return '(' + polygon.map(ring => {
					return ring.map(coord => `${coord[0]} ${coord[1]}`).join(', ');
				}).join(', ') + ')';
			}).join(', ');
			wkt += ')';
		} else if (geojson.type === 'Point') {
			// Handle Point geometry
			wkt = `POINT(${geojson.coordinates[0]} ${geojson.coordinates[1]})`;
		} else if (geojson.type === 'LineString') {
			// Handle LineString geometry
			wkt = `LINESTRING(${geojson.coordinates.map(coord => `${coord[0]} ${coord[1]}`).join(', ')})`;
		}

		return wkt;
	}

	function geojsonToWKTx(geojson) {

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
	}

	window.addEventListener('load', function () {

		// Save the original XMLHttpRequest open method
		const originalOpen = XMLHttpRequest.prototype.open;

		// Override the open method
		XMLHttpRequest.prototype.open = function (...args) {
			var loadGEOM = (args[1] || "").indexOf("/geom_") > -1;
			if (!loadGEOM)
				deleteElementOnAjax();

			return originalOpen.apply(this, args); // Call the original method
		};

		// Function to delete the element
		function deleteElementOnAjax() {
			let element = document.getElementById("map-shape-message");
			if (element)
				element.remove();
		}

		const container = document.createElement('div');
		container.classList.add('fc-Save-search');

		container.innerHTML = `<button id="btn-copy" aria-label="Copiar Shape" class="sui-AtomButton sui-AtomButton--primary sui-AtomButton--solid sui-AtomButton--center sui-AtomButton--fullWidth">
      <span class="sui-AtomButton-inner">
        <span class="sui-AtomButton-leftIcon">
          <div class="bell-animation">
<svg viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" style="width: 26px; height: 26px;">
  <path d="M227.8,52.2a28,28,0,0,0-39.6,0h0a28,28,0,0,0-5.88,8.65l-34.55-9.42A28,28,0,0,0,100.2,28.2h0a28,28,0,0,0-3.47,35.36L57.92,98.49A28,28,0,0,0,20.2,100.2h0a28,28,0,0,0,39.6,39.6l.18-.19,75.31,55.23A28,28,0,1,0,173,183.2l29.55-83.75A28,28,0,0,0,227.8,91.8,28,28,0,0,0,227.8,52.2ZM105.86,33.86h0a20,20,0,1,1,0,28.28A20,20,0,0,1,105.86,33.86Zm-80,100.28a20,20,0,0,1,0-28.28h0a20,20,0,1,1,0,28.28Zm148.28,88a20,20,0,0,1-28.28-28.28h0a20,20,0,0,1,28.28,28.28Zm-8.69-41.59a28,28,0,0,0-25.25,7.65h0l-.18.19L64.71,133.16a28.06,28.06,0,0,0-1.44-28.72l38.81-34.93a28,28,0,0,0,43.6-10.36l34.55,9.42A28,28,0,0,0,195,96.8Zm56.69-94.41a20,20,0,0,1-28.28-28.28h0a20,20,0,0,1,28.28,28.28Z"/>
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

		button.onclick = async function (e) {
			button.dataset.wkt = true;

			// Get the latest searches from localStorage
			const ids = JSON.parse(localStorage.getItem('LatestsSearches'))[0].combinedLocationIds.split(";");

			const features = {
				type: "FeatureCollection",
				features: []
			};

			try {
				// Iterate over each location id and fetch data asynchronously
				for (let id of ids) {
					const location = id.replace(/,/g, '_');
					const url = fetchurl + location + ".js";

					const response = await fetch(url);
					if (!response.ok) {
						console.error('Request failed with status:', response.status);
						continue;  // Skip to next location if request fails
					}

					let jsonstr = await response.text();
					jsonstr = jsonstr.replace(/(var(:?.*)geom_(:?.*)(?:\s)\=(?:\s))+/gm, "");

					const feature = JSON.parse(jsonstr);
					features.features.push(feature);
				}

				console.log("features", features);

				const wkt = geojsonToWKT(features);
				console.log("wkt", wkt);

				copyToCipboard(wkt);

				// Remove existing messages
				let msg = document.getElementById("map-undo-message");
				if (msg) msg.remove();

				let element = document.getElementById("map-shape-message");
				if (element) element.remove();

				// Create and display new message
				msg = document.createElement("div");
				msg.id = "map-shape-message";
				msg.style.width = "100%";
				msg.style.textAlign = "center";
				msg.style.backgroundColor = "var(--c-secondary-dark-2)";
				msg.style.color = "#fff";

				msg.innerHTML = "SHAPE Zona visível, copiada para o clipboard<br />Verificar -> <a id='shapetest' href='" + validator + "' target='_shapetest' style='color: #fff; text-decoration: none; font-weight: 600;'> Shape Test!</a>";

				const map = document.querySelector(".re-SearchMapWrapper");
				map.insertBefore(msg, map.firstChild);

			} catch (error) {
				console.error('An error occurred:', error);
			}

			return false;
		};

		//}, 3000);
	}, false);
})();