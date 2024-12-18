(function () {
	const VALIDATOR_URL = "https://wkt-playground.zecompadre.com";
	const FETCH_URL_BASE = "https://geom.fotocasa.es/v104/geom_";

	function geojsonToWKT(geojson) {
		const wktArray = [];

		function convertPoint(point) {
			return `POINT (${point[0]} ${point[1]})`;
		}

		function convertMultiPoint(multiPoint) {
			return `MULTIPOINT (${multiPoint.map(point => `(${point[0]} ${point[1]})`).join(', ')})`;
		}

		function convertLineString(lineString) {
			return `LINESTRING (${lineString.map(point => `${point[0]} ${point[1]}`).join(', ')})`;
		}

		function convertMultiLineString(multiLineString) {
			return `MULTILINESTRING (${multiLineString.map(line =>
				`(${line.map(point => `${point[0]} ${point[1]}`).join(', ')})`
			).join(', ')})`;
		}

		function convertPolygon(polygon) {
			const rings = polygon.coordinates;
			return `POLYGON (${rings.map(ring =>
				`(${ring.map(point => `${point[0]} ${point[1]}`).join(', ')})`
			).join(', ')})`;
		}

		function convertMultiPolygon(multiPolygon) {
			return `MULTIPOLYGON (${multiPolygon.coordinates.map(polygon =>
				`(${polygon.map(ring =>
					`(${ring.map(point => `${point[0]} ${point[1]}`).join(', ')})`
				).join(', ')})`
			).join(', ')})`;
		}

		function convertGeometry(geometry) {
			if (geometry.coordinates && geometry.coordinates.length > 0)  // Filter out geometries with no coordinates
			{
				switch (geometry.type) {
					case 'Point':
						wktArray.push(convertPoint(geometry.coordinates));
						break;
					case 'MultiPoint':
						wktArray.push(convertMultiPoint(geometry.coordinates));
						break;
					case 'LineString':
						wktArray.push(convertLineString(geometry.coordinates));
						break;
					case 'MultiLineString':
						wktArray.push(convertMultiLineString(geometry.coordinates));
						break;
					case 'Polygon':
						wktArray.push(convertPolygon(geometry));
						break;
					case 'MultiPolygon':
						wktArray.push(convertMultiPolygon(geometry));
						break;
					case 'GeometryCollection':
						// Convert all polygons in the GeometryCollection to a single MULTIPOLYGON
						const polygons = geometry.geometries.filter(g => g.type === 'Polygon' || g.type === 'MultiPolygon');
						const multiPolygonCoordinates = polygons.flatMap(p =>
							p.type === 'Polygon' ? [p.coordinates] : p.coordinates
						);
						wktArray.push(convertMultiPolygon({ coordinates: multiPolygonCoordinates }));
						break;
					default:
						throw new Error(`Unsupported geometry type: ${geometry.type}`);
				}
			}
		}

		if (geojson.features && Array.isArray(geojson.features)) {
			geojson.features.forEach(feature => convertGeometry(feature.geometry));
		} else if (geojson.type === 'FeatureCollection') {
			geojson.features.forEach(feature => convertGeometry(feature.geometry));
		} else if (geojson.type === 'Feature') {
			convertGeometry(geojson.geometry);
		} else if (geojson.type === 'GeometryCollection') {
			convertGeometry(geojson);
		} else {
			throw new Error('Invalid GeoJSON structure');
		}

		return wktArray;
	}

	function geojsonToWKT_2(geoJSON) {
		return geoJSON.features
			.filter(({ geometry }) => geometry.coordinates && geometry.coordinates.length > 0)  // Filter out geometries with no coordinates
			.map(({ geometry }) => {
				switch (geometry.type) {
					case "Polygon":
						return `POLYGON ((${geometry.coordinates[0].map(coord => coord.join(" ")).join(", ")}))`;

					case "MultiPolygon":
						return `MULTIPOLYGON (${geometry.coordinates
							.map(polygon => `((${polygon[0].map(coord => coord.join(" ")).join(", ")}))`)
							.join(", ")})`;

					case "Point":
						return `POINT (${geometry.coordinates.join(" ")})`;

					case "MultiPoint":
						return `MULTIPOINT (${geometry.coordinates.map(coord => `(${coord.join(" ")})`).join(", ")})`;

					case "LineString":
						return `LINESTRING (${geometry.coordinates.map(coord => coord.join(" ")).join(", ")})`;

					case "MultiLineString":
						return `MULTILINESTRING (${geometry.coordinates
							.map(line => `(${line.map(coord => coord.join(" ")).join(", ")})`)
							.join(", ")})`;

					case "GeometryCollection":
						return `GEOMETRYCOLLECTION (${geometry.geometries
							.map(geom => geojsonToWKT({ features: [{ geometry: geom }] })[0])  // Recursive call for each geometry in the collection
							.join(", ")})`;

					default:
						throw new Error(`Unsupported geometry type: ${geometry.type}`);
				}
			});
	}

	function geojsonToWKTy(geoJSON) {
		return geoJSON.features
			.map(({ geometry }) => {
				// Ensure geometry has coordinates before processing
				if (!geometry.coordinates || geometry.coordinates.length === 0) {
					return null; // Skip geometries without coordinates
				}

				switch (geometry.type) {
					case "Polygon":
						return `POLYGON ((${geometry.coordinates[0].map(coord => coord.join(" ")).join(", ")}))`;

					case "MultiPolygon":
						return `MULTIPOLYGON (${geometry.coordinates
							.map(polygon => `((${polygon[0].map(coord => coord.join(" ")).join(", ")}))`)
							.join(", ")})`;

					case "Point":
						return `POINT (${geometry.coordinates.join(" ")})`;

					case "MultiPoint":
						return `MULTIPOINT (${geometry.coordinates.map(coord => `(${coord.join(" ")})`).join(", ")})`;

					case "LineString":
						return `LINESTRING (${geometry.coordinates.map(coord => coord.join(" ")).join(", ")})`;

					case "MultiLineString":
						return `MULTILINESTRING (${geometry.coordinates
							.map(line => `(${line.map(coord => coord.join(" ")).join(", ")})`)
							.join(", ")})`;

					case "GeometryCollection":
						// Handle GeometryCollection, ensure each geometry is correctly converted
						return `GEOMETRYCOLLECTION (${geometry.geometries
							.map(geom => {
								// Recursively handle each geometry in the collection
								if (geom.coordinates && geom.coordinates.length > 0) {
									return geojsonToWKT({ features: [{ geometry: geom }] })[0];
								}
								return null; // Skip invalid geometries in the collection
							})
							.filter(geom => geom !== null) // Filter out null results
							.join(", ")})`;

					default:
						return null;  // Return null for unsupported geometry types
				}
			})
			.filter(result => result !== null);  // Filter out null values from the final result
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
			console.log("features", features);
			const wkt = geojsonToWKT(features);

			copyToClipboard(wkt.join("\n"));

			showMessage(`
        SHAPE Zona visível, copiada para o clipboard<br />
        Verificar -> <a href="${VALIDATOR_URL}" target="_blank" style="color: #fff; text-decoration: none; font-weight: 600;">Shape Test!</a>
      `);

			return false;
		};
	});
})();
