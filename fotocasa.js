(function () {

	var validator = "https://wkt-playground.zecompadre.com";
	//var validator = "https://wkt-plotter.zecompadre.com";
	var fetchurl = "https://geom.fotocasa.es/v104/geom_";

	function geojsonToWKT(geoJson) {

		// Check if there's only one feature or more
		if (geoJson.features.length === 1) {
			// Single feature: Convert to WKT Polygon
			const feature = geoJson.features[0];
			if (feature.geometry.type === "Polygon") {
				let coordinates = feature.geometry.coordinates[0];
				let wktCoordinates = coordinates.map(coord => coord.join(' ')).join(', ');
				return `POLYGON((${wktCoordinates}))`;
			}
		} else if (geoJson.features.length > 1) {
			// Multiple features: Convert to WKT MultiPolygon
			let multiPolygonCoordinates = geoJson.features.map(feature => {
				if (feature.geometry.type === "Polygon") {
					let coordinates = feature.geometry.coordinates[0];
					return `(${coordinates.map(coord => coord.join(' ')).join(', ')})`;
				}
			}).join(', ');

			multiPolygonCoordinates = multiPolygonCoordinates.replace(", , ", ", ");

			return `MULTIPOLYGON((${multiPolygonCoordinates}))`;
		}
		return null; // Return null if no valid Polygon or MultiPolygon features
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
				const featurePromises = ids.map(async (id) => {
					const location = id.replace(/,/g, '_');
					const url = fetchurl + location + ".js";

					try {
						const response = await fetch(url);
						if (!response.ok) {
							console.error('Request failed with status:', response.status);
							return null;  // Return null or skip the current fetch if it fails
						}

						let jsonstr = await response.text();
						jsonstr = jsonstr.replace(/(var(:?.*)geom_(:?.*)(?:\s)\=(?:\s))+/gm, "");

						const feature = JSON.parse(jsonstr);
						return feature;
					} catch (error) {
						console.error('Error fetching data for location', location, error);
						return null;  // Handle any errors in individual fetch requests
					}
				});

				// Wait for all fetches to complete and filter out any failed responses (null values)
				const featuresArray = await Promise.all(featurePromises);
				features.features.push(...featuresArray.filter(feature => feature !== null));

				//console.log("features", features);

				const wkt = geojsonToWKT(features);
				//console.log("wkt", wkt);

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