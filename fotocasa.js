(function () {

	const validator = "https://wkt-playground.zecompadre.com";
	const fetchurl = "https://geom.fotocasa.es/v104/geom_";

	function geojsonToWKT(geoJSON) {
		return geoJSON.features.map(feature => {
			const {
				geometry
			} = feature;
			switch (geometry.type) {
				case "Polygon":
					return `POLYGON ((${geometry.coordinates[0].map(coord => coord.join(" ")).join(", ")}))`;
				case "MultiPolygon":
					return `MULTIPOLYGON (${geometry.coordinates.map(polygon => `((${polygon[0].map(coord => coord.join(" ")).join(", ")}))`).join(", ")})`;
				default:
					throw new Error(`Unsupported geometry type: ${geometry.type}`);
			}
		});
	}

	window.addEventListener('load', function () {

		// Function to delete the element
		function deleteElementOnAjax() {
			const element = document.getElementById("map-shape-message");
			if (element) element.remove();
		}

		const container = document.createElement('div');
		container.classList.add('fc-Save-search');
		container.innerHTML = `
            <button id="btn-copy" aria-label="Copiar Shape" class="sui-AtomButton sui-AtomButton--primary sui-AtomButton--solid sui-AtomButton--center sui-AtomButton--fullWidth">
                <span class="sui-AtomButton-inner">
                    <span class="sui-AtomButton-leftIcon">
                        <div class="bell-animation">
                            <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" style="width: 26px; height: 26px;">
                                <path d="M227.8,52.2a28,28,0,0,0-39.6,0h0a28,28,0,0,0-5.88,8.65l-34.55-9.42A28,28,0,0,0,100.2,28.2h0a28,28,0,0,0-3.47,35.36L57.92,98.49A28,28,0,0,0,20.2,100.2h0a28,28,0,0,0,39.6,39.6l.18-.19,75.31,55.23A28,28,0,1,0,173,183.2l29.55-83.75A28,28,0,0,0,227.8,91.8,28,28,0,0,0,227.8,52.2ZM105.86,33.86h0a20,20,0,1,1,0,28.28A20,20,0,0,1,105.86,33.86Zm-80,100.28a20,20,0,0,1,0-28.28h0a20,20,0,1,1,0,28.28Zm148.28,88a20,20,0,0,1-28.28-28.28h0a20,20,0,0,1,28.28,28.28Zm-8.69-41.59a28,28,0,0,0-25.25,7.65h0l-.18.19L64.71,133.16a28.06,28.06,0,0,0-1.44-28.72l38.81-34.93a28,28,0,0,0,43.6-10.36l34.55,9.42A28,28,0,0,0,195,96.8Zm56.69-94.41a20,20,0,0,1-28.28-28.28h0a20,20,0,0,1,28.28,28.28Z"/>
                            </svg>
                        </div>
                    </span>
                    <span class="sui-AtomButton-content">
                        <span>Copiar Shape</span>
                    </span>
                </span>
            </button>`;

		const targetDiv = document.querySelector('.fc-Save-search');
		targetDiv.insertAdjacentElement('afterend', container.firstElementChild);

		const button = document.getElementById("btn-copy");

		button.onclick = async function (e) {
			deleteElementOnAjax();

			button.dataset.wkt = true;

			console.log("LatestsSearches", localStorage.getItem('LatestsSearches'));
			console.log("MyLastSearch", localStorage.getItem('MyLastSearch'));

			// Get the latest searches from localStorage
			//const ids = JSON.parse(localStorage.getItem('LatestsSearches'))[0].combinedLocationIds.split(";");

			//const data = JSON.parse(localStorage.getItem('LatestsSearches')); // Parse the stored JSON data
			//const ids = data.flatMap(item => item.combinedLocationIds.split(";")); // Extract and split all combinedLocationIds into a single array

			// Extract data from localStorage
			const LatestsSearches = JSON.parse(localStorage.getItem('LatestsSearches'));
			const idsLatestsSearches = LatestsSearches ? LatestsSearches.flatMap(item => item.combinedLocationIds.split(";")) : [];

			const MyLastSearch = JSON.parse(localStorage.getItem('MyLastSearch'));

			var idsMyLastSearch = MyLastSearch.combinedLocationIds.split(";").map(segment => segment.replace(/,/g, "_"));

			//console.log(idsMyLastSearch)

			// Combine both arrays and ensure distinct values
			//...localStorageIds, 
			const allIds = [...new Set([...idsMyLastSearch])];

			console.log(allIds);

			//console.dir("ids", ids);

			const features = {
				type: "FeatureCollection",
				features: []
			};

			const featurePromises = allIds.map(id => {

				console.log("id", id);

				const primaryUrl = `${fetchurl}${location}_g.js`;
				const fallbackUrl = `${fetchurl}${location}.js`;

				console.log("primaryUrl", primaryUrl);
				console.log("fallbackUrl", fallbackUrl);

				// Fetch data and handle fallback
				return fetchAndParse(primaryUrl).catch(() => fetchAndParse(fallbackUrl));
			});

			// Helper function to fetch and parse JSON
			async function fetchAndParse(url) {
				try {
					const response = await fetch(url);
					if (!response.ok) throw new Error('Request failed');

					const jsonstr = await response.text();
					const cleanedJson = jsonstr.replace(/(var(:?.*)geom_(:?.*)(?:\s)\=(?:\s))+/gm, "");
					return JSON.parse(cleanedJson);
				} catch (error) {
					console.error('Error fetching data for URL:', url, error);
					return null;
				}
			}

			// Resolve feature promises and process the features
			const featuresArray = await Promise.all(featurePromises);
			features.features.push(...featuresArray.filter(item => item && item.type === "FeatureCollection").flatMap(item => item.features));

			// Convert features to WKT and copy to clipboard
			const wkt = geojsonToWKT(features);
			//console.log("wkt", wkt.join("\n"));
			copyToCipboard(wkt.join("\n"));

			// Create success message
			createSuccessMessage();

			return false;
		};

		// Create success message
		function createSuccessMessage() {
			let msg = document.createElement("div");
			msg.id = "map-shape-message";
			msg.style.width = "100%";
			msg.style.textAlign = "center";
			msg.style.backgroundColor = "var(--c-secondary-dark-2)";
			msg.style.color = "#fff";
			msg.innerHTML = `SHAPE Zona visível, copiada para o clipboard<br />Verificar -> <a id='shapetest' href='${validator}' target='_shapetest' style='color: #fff; text-decoration: none; font-weight: 600;'> Shape Test!</a>`;

			const map = document.querySelector(".re-SearchMapWrapper");
			map.insertBefore(msg, map.firstChild);
		}
	}, false);
})();