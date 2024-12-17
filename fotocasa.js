(function () {

	var validator = "https://wkt-playground.zecompadre.com";
	//var validator = "https://wkt-plotter.zecompadre.com";
	var fetchurl = "https://geom.fotocasa.es/v104/geom_";

	function geojsonToWKT(geoJSON) {
		const features = geoJSON.features;
		const wkts = features.map(feature => {
			const geometry = feature.geometry;
			switch (geometry.type) {
				case "Polygon":
					return `POLYGON ((${geometry.coordinates[0]
						.map(coord => coord.join(" "))
						.join(", ")}))`;
				case "MultiPolygon":
					return `MULTIPOLYGON (${geometry.coordinates
						.map(polygon => `((${polygon[0]
							.map(coord => coord.join(" "))
							.join(", ")}))`)
						.join(", ")})`;
				default:
					throw new Error(`Unsupported geometry type: ${geometry.type}`);
			}
		});
		return wkts;
	}

	window.addEventListener('load', function () {
		/*
				// Save the original XMLHttpRequest open method
				const originalOpen = XMLHttpRequest.prototype.open;

				// Override the open method
				XMLHttpRequest.prototype.open = function (...args) {
					var loadGEOM = (args[1] || "").indexOf("/geom_") > -1;
					if (!loadGEOM)
						deleteElementOnAjax();

					return originalOpen.apply(this, args); // Call the original method
				};
		*/
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

			deleteElementOnAjax();

			button.dataset.wkt = true;

			// Get the latest searches from localStorage
			const ids = JSON.parse(localStorage.getItem('LatestsSearches'))[0].combinedLocationIds.split(";");

			console.log("ids", ids);

			const features = {
				type: "FeatureCollection",
				features: []
			};

			const featurePromises = ids.map(async (id) => {
				const location = id.replace(/,/g, '_');
				const primaryUrl = `${fetchurl}${location}_g.js`; // Primary URL
				const fallbackUrl = `${fetchurl}${location}.js`; // Fallback URL

				// Helper function to fetch and process data
				const fetchAndParse = async (url) => {
					try {
						const response = await fetch(url);
						if (!response.ok) {
							console.error('Request failed with status:', response.status, 'for URL:', url);
							return null; // Skip if fetch fails
						}

						let jsonstr = await response.text();
						jsonstr = jsonstr.replace(/(var(:?.*)geom_(:?.*)(?:\s)\=(?:\s))+/gm, ""); // Clean up the string

						try {
							return JSON.parse(jsonstr); // Parse JSON
						} catch (parseError) {
							console.error('Failed to parse JSON:', parseError, 'for URL:', url);
							return null;
						}
					} catch (error) {
						console.error('Error fetching data for URL:', url, error);
						return null; // Handle fetch errors
					}
				};

				// Attempt primary URL first, then fallback if needed
				let feature = await fetchAndParse(primaryUrl);
				if (!feature) {
					console.warn('Primary URL failed. Trying fallback URL for location:', location);
					feature = await fetchAndParse(fallbackUrl);
				}

				return feature; // Return feature or null if both URLs fail
			});

			// Wait for all fetches to complete
			const featuresArray = await Promise.all(featurePromises);

			console.log("featuresArray", featuresArray);

			// Process fetched features
			featuresArray.forEach((item) => {
				if (item && item.type === "FeatureCollection") {
					// If it's a FeatureCollection, merge its features into the main collection
					features.features.push(...item.features);
				} else if (item) {
					// If it's a single feature, add it directly to the features array
					features.features.push(item);
				}
			});

			console.log('Features added successfully:', JSON.stringify(features.features));

			console.log("features", JSON.stringify(features));

			const wkt = geojsonToWKT(features);
			console.log("wkt", wkt.join("\n"));

			copyToCipboard(wkt.join("\n"));

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

			return false;
		};

		//}, 3000);
	}, false);
})();