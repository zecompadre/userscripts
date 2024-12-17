(function () {
	const VALIDATOR_URL = "https://wkt-playground.zecompadre.com";
	const FETCH_URL_BASE = "https://geom.fotocasa.es/v104/geom_";

	function geojsonToWKT(geoJSON) {
		return geoJSON.features.map(({ geometry }) => {
			switch (geometry.type) {
				case "Polygon":
					return `POLYGON ((${geometry.coordinates[0].map(coord => coord.join(" ")).join(", ")}))`;
				case "MultiPolygon":
					return `MULTIPOLYGON (${geometry.coordinates
						.map(polygon => `((${polygon[0].map(coord => coord.join(" ")).join(", ")
							}))`)
						.join(", ")})`;
				default:
					throw new Error(`Unsupported geometry type: ${geometry.type}`);
			}
		});
	}

	async function fetchFeature(location) {
		const urls = [
			`${FETCH_URL_BASE}${location}_g.js`,
			`${FETCH_URL_BASE}${location}.js`
		];

		for (const url of urls) {
			try {
				const response = await fetch(url);
				if (!response.ok) {
					console.warn(`Failed to fetch: ${url} (status: ${response.status})`);
					continue;
				}

				const jsonText = (await response.text()).replace(/var\s*geom_\w+\s*=\s*/, "");
				return JSON.parse(jsonText);
			} catch (error) {
				console.error(`Error fetching or parsing data for URL: ${url}`, error);
			}
		}

		console.warn(`All fetch attempts failed for location: ${location}`);
		return null;
	}

	function copyToClipboard(text) {
		navigator.clipboard.writeText(text).catch(err => console.error("Clipboard copy failed", err));
	}

	function showMessage(messageHTML) {
		const existingMessage = document.getElementById("map-shape-message");
		if (existingMessage) existingMessage.remove();

		const messageDiv = document.createElement("div");
		messageDiv.id = "map-shape-message";
		messageDiv.style.cssText = "width: 100%; text-align: center; background-color: var(--c-secondary-dark-2); color: #fff;";
		messageDiv.innerHTML = messageHTML;

		const mapContainer = document.querySelector(".re-SearchMapWrapper");
		mapContainer.insertBefore(messageDiv, mapContainer.firstChild);
	}

	window.addEventListener("load", () => {
		const buttonContainer = document.createElement("div");
		buttonContainer.classList.add("fc-Save-search");

		buttonContainer.innerHTML = `
		<button id="btn-copy" aria-label="Copiar Shape" class="sui-AtomButton sui-AtomButton--primary sui-AtomButton--solid sui-AtomButton--center sui-AtomButton--fullWidth">
		  <span class="sui-AtomButton-inner">
			<span class="sui-AtomButton-leftIcon">
			  <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" style="width: 26px; height: 26px;">
				<path d="M227.8,52.2a28,28,0,0,0-39.6,0h0a28,28,0,0,0-5.88,8.65l-34.55-9.42A28,28,0,0,0,100.2,28.2h0a28,28,0,0,0-3.47,35.36L57.92,98.49A28,28,0,0,0,20.2,100.2h0a28,28,0,0,0,39.6,39.6l.18-.19,75.31,55.23A28,28,0,1,0,173,183.2l29.55-83.75A28,28,0,0,0,227.8,91.8,28,28,0,0,0,227.8,52.2ZM105.86,33.86h0a20,20,0,1,1,0,28.28A20,20,0,0,1,105.86,33.86Zm-80,100.28a20,20,0,0,1,0-28.28h0a20,20,0,1,1,0,28.28Zm148.28,88a20,20,0,0,1-28.28-28.28h0a20,20,0,0,1,28.28,28.28Zm-8.69-41.59a28,28,0,0,0-25.25,7.65h0l-.18.19L64.71,133.16a28.06,28.06,0,0,0-1.44-28.72l38.81-34.93a28,28,0,0,0,43.6-10.36l34.55,9.42A28,28,0,0,0,195,96.8Zm56.69-94.41a20,20,0,0,1-28.28-28.28h0a20,20,0,0,1,28.28,28.28Z"/>
			  </svg>
			</span>
			<span class="sui-AtomButton-content">
			  <span>Copiar Shape</span>
			</span>
		  </span>
		</button>`;

		const targetDiv = document.querySelector(".fc-Save-search");
		targetDiv.insertAdjacentElement("afterend", buttonContainer.firstElementChild);

		document.getElementById("btn-copy").onclick = async function () {
			const button = this;
			button.dataset.wkt = true;

			const latestSearches = JSON.parse(localStorage.getItem("LatestsSearches"));
			const ids = latestSearches[0].combinedLocationIds.split(";");

			const features = { type: "FeatureCollection", features: [] };
			const fetchPromises = ids.map(id => fetchFeature(id.replace(/,/g, "_")));

			const results = await Promise.all(fetchPromises);
			results.forEach(item => {
				if (item?.type === "FeatureCollection") {
					features.features.push(...item.features);
				} else if (item) {
					features.features.push(item);
				}
			});

			console.log(features)

			const wkt = geojsonToWKT(features);

			const locationNames = features.map(feature => feature.properties.LocationName);

			console.log(locationNames)

			copyToClipboard(wkt.join("\n"));

			showMessage(`
		  SHAPE Zona visível, copiada para o clipboard<br />
		  Verificar -> <a href="${VALIDATOR_URL}" target="_blank" style="color: #fff; text-decoration: none; font-weight: 600;">Shape Test!</a>
		`);

			return false;
		};
	});
})();
