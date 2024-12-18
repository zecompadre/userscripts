(function () {
	const VALIDATOR_URL = "https://wkt-playground.zecompadre.com";
	const FETCH_URL_BASE = "https://geom.fotocasa.es/v104/geom_";

	/**
	 * Class to convert GeoJSON geometries to Well-Known Text (WKT) format.
	 */
	class GeoJSONToWKT {
		/**
		 * Creates an instance of GeoJSONToWKT.
		 * @param {Object} geojson - The GeoJSON object to be converted to WKT.
		 */
		constructor(geojson) {
			this.geojson = geojson;
		}

		/**
		 * Converts a Point geometry to WKT format.
		 * @param {Array} point - The coordinates of the point [longitude, latitude].
		 * @returns {string} - The WKT representation of the Point.
		 */
		convertPoint(point) {
			return `POINT (${point[0]} ${point[1]})`;
		}

		/**
		 * Converts a MultiPoint geometry to WKT format.
		 * @param {Array} multiPoint - The array of point coordinates [[longitude, latitude], ...].
		 * @returns {string} - The WKT representation of the MultiPoint.
		 */
		convertMultiPoint(multiPoint) {
			return `MULTIPOINT (${multiPoint.map(point => `(${point[0]} ${point[1]})`).join(', ')})`;
		}

		/**
		 * Converts a LineString geometry to WKT format.
		 * @param {Array} lineString - The array of point coordinates [[longitude, latitude], ...].
		 * @returns {string|null} - The WKT representation of the LineString, or null if empty.
		 */
		convertLineString(lineString) {
			return lineString.length > 0 ? `LINESTRING (${lineString.map(point => `${point[0]} ${point[1]}`).join(', ')})` : null;
		}

		/**
		 * Converts a MultiLineString geometry to WKT format.
		 * @param {Array} multiLineString - The array of LineString geometries ([[longitude, latitude], ...], ...).
		 * @returns {string|null} - The WKT representation of the MultiLineString, or null if empty.
		 */
		convertMultiLineString(multiLineString) {
			const validLines = multiLineString.filter(line => line.length > 0);
			return validLines.length > 0 ? `MULTILINESTRING (${validLines.map(line =>
				`(${line.map(point => `${point[0]} ${point[1]}`).join(', ')})`).join(', ')})` : null;
		}

		/**
		 * Converts a Polygon geometry to WKT format.
		 * @param {Object} polygon - The Polygon geometry object with coordinates as an array of rings.
		 * @returns {string|null} - The WKT representation of the Polygon, or null if empty.
		 */
		convertPolygon(polygon) {
			const rings = polygon.coordinates.filter(ring => ring.length > 0);
			return rings.length > 0 ? `POLYGON (${rings.map(ring =>
				`(${ring.map(point => `${point[0]} ${point[1]}`).join(', ')})`).join(', ')})` : null;
		}

		/**
		 * Converts a MultiPolygon geometry to WKT format.
		 * @param {Object} multiPolygon - The MultiPolygon geometry object with coordinates as an array of polygons.
		 * @returns {string|null} - The WKT representation of the MultiPolygon, or null if empty.
		 */
		convertMultiPolygon(multiPolygon) {
			const validPolygons = multiPolygon.coordinates.filter(polygon => polygon.length > 0);
			return validPolygons.length > 0 ? `MULTIPOLYGON (${validPolygons.map(polygon =>
				`(${polygon.map(ring =>
					`(${ring.map(point => `${point[0]} ${point[1]}`).join(', ')})`).join(', ')})`).join(', ')})` : null;
		}

		/**
		 * Converts a GeometryCollection to WKT format, including only Polygon and MultiPolygon types.
		 * @param {Object} geometryCollection - The GeometryCollection object.
		 * @returns {string|null} - The WKT representation of the GeometryCollection, or null if no valid geometries.
		 */
		convertGeometryCollection(geometryCollection) {
			const polygons = geometryCollection.geometries.filter(g => ['Polygon', 'MultiPolygon'].includes(g.type));
			const multiPolygonCoordinates = polygons.flatMap(p =>
				p.type === 'Polygon' ? [p.coordinates] : p.coordinates
			);
			return this.convertMultiPolygon({ coordinates: multiPolygonCoordinates });
		}

		/**
		 * Converts a GeoJSON geometry to WKT format based on its type.
		 * @param {Object} geometry - The GeoJSON geometry object.
		 * @returns {string|null} - The WKT representation of the geometry, or null if unsupported.
		 */
		convertGeometry(geometry) {
			switch (geometry.type) {
				case 'Point': return this.convertPoint(geometry.coordinates);
				case 'MultiPoint': return this.convertMultiPoint(geometry.coordinates);
				case 'LineString': return this.convertLineString(geometry.coordinates);
				case 'MultiLineString': return this.convertMultiLineString(geometry.coordinates);
				case 'Polygon': return this.convertPolygon(geometry);
				case 'MultiPolygon': return this.convertMultiPolygon(geometry);
				case 'GeometryCollection': return this.convertGeometryCollection(geometry);
				default: throw new Error(`Unsupported geometry type: ${geometry.type}`);
			}
		}

		/**
		 * Converts the GeoJSON object (FeatureCollection or Feature) to an array of WKT representations.
		 * @returns {Array<string>} - The array of WKT strings corresponding to the geometries.
		 * @throws {Error} - Throws an error if the GeoJSON structure is invalid.
		 */
		convert() {
			const wktArray = [];

			if (this.geojson.features) {
				this.geojson.features.forEach(feature => {
					const wkt = this.convertGeometry(feature.geometry);
					if (wkt) wktArray.push(wkt);
				});
			} else if (this.geojson.type === 'FeatureCollection') {
				this.geojson.features.forEach(feature => {
					const wkt = this.convertGeometry(feature.geometry);
					if (wkt) wktArray.push(wkt);
				});
			} else if (this.geojson.type === 'Feature') {
				const wkt = this.convertGeometry(this.geojson.geometry);
				if (wkt) wktArray.push(wkt);
			} else if (this.geojson.type === 'GeometryCollection') {
				const wkt = this.convertGeometry(this.geojson);
				if (wkt) wktArray.push(wkt);
			} else {
				throw new Error('Invalid GeoJSON structure');
			}

			return wktArray;
		}
	}

	/**
	 * Fetch GeoJSON data from a given location ID.
	 * Attempts to fetch the GeoJSON data from two different URLs in sequence.
	 * If the first URL fails, it will try the second one. If both fail, it returns `null`.
	 * 
	 * @param {string} location - The location ID used to construct the URL for fetching the data.
	 * @returns {Promise<Object|null>} - The GeoJSON object parsed from the response, or `null` if both fetch attempts fail.
	 * 
	 * @example
	 * const geojson = await fetchFeature("12345");
	 * if (geojson) {
	 *     console.log("GeoJSON data:", geojson);
	 * } else {
	 *     console.log("Failed to fetch GeoJSON data.");
	 * }
	 */
	async function fetchFeature(location) {
		const urls = [
			`${FETCH_URL_BASE}${location}_g.js`,
			`${FETCH_URL_BASE}${location}.js`,
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

	/**
	 * Copy text to the clipboard.
	 * Uses the Clipboard API to write the provided text to the user's clipboard.
	 * If the operation fails, an error is logged to the console.
	 * 
	 * @param {string} text - The text to copy to the clipboard.
	 * 
	 * @example
	 * copyToClipboard("Hello, World!");
	 * // The text "Hello, World!" will be copied to the clipboard.
	 */
	function copyToClipboard(text) {
		navigator.clipboard.writeText(text).catch((err) => console.error("Clipboard copy failed", err));
	}

	/**
	 * Display a message at the top of the map container.
	 * This function creates a message element and inserts it at the top of the map container.
	 * If a message already exists, it will be removed before adding the new one.
	 * 
	 * @param {string} messageHTML - The HTML content of the message to display.
	 * 
	 * @example
	 * showMessage("<strong>Important:</strong> Map data updated.");
	 * // This will display a message at the top of the map container with the provided HTML content.
	 */
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

	/**
	 * Adds a button to copy WKT data to the clipboard.
	 * When the button is clicked, it fetches the latest search results, converts them to WKT format, 
	 * copies the WKT data to the clipboard, and displays a success message.
	 * 
	 * @listens load
	 * @fires fetchFeature - Fetches GeoJSON data for the latest search results.
	 * @fires copyToClipboard - Copies the generated WKT data to the clipboard.
	 * @fires showMessage - Displays a message to the user indicating that the WKT data has been copied to the clipboard.
	 * 
	 * @example
	 * // Once the page loads, a button to copy the WKT data will appear.
	 * // Clicking it will fetch the latest search results and copy the WKT data to the clipboard.
	 */
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
			const latestSearches = JSON.parse(localStorage.getItem("LatestsSearches"));
			const ids = latestSearches[0].combinedLocationIds.split(";");

			const geoJSON = { type: "FeatureCollection", features: [] };
			const fetchPromises = ids.map((id) => fetchFeature(id.replace(/,/g, "_")));

			const results = await Promise.all(fetchPromises);
			results.forEach((item) => {
				if (item?.type === "FeatureCollection") {
					geoJSON.features.push(...item.features);
				} else if (item) {
					geoJSON.features.push(item);
				}
			});

			const wkt = new GeoJSONToWKT(geoJSON).convert();

			copyToClipboard(wkt.join("\n"));

			showMessage(`
				SHAPE Zona visível, copiada para o clipboard<br />
				Verificar -> <a href="${VALIDATOR_URL}" target="_blank" style="color: #fff; text-decoration: none; font-weight: 600;">Shape Test!</a>
			`);

			return false;
		};
	});
})();
