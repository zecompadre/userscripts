(function () {

	var validator = "https://wkt-playground.zecompadre.com";
	//var validator = "https://wkt-plotter.zecompadre.com";
	var fetchurl = "https://geom.fotocasa.es/v104/geom_";

	function geojsonToWKT(geojson) {


		var wkt_options = {};
		var geojson_format = new OpenLayers.Format.GeoJSON();
		var testFeature = geojson_format.read(geojson);
		var wkt = new OpenLayers.Format.WKT(wkt_options);
		return wkt.write(testFeature);


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

	function geojsonToWKT2(geojson) {

		// Function to convert coordinates to WKT format
		function coordsToWkt(coords) {
			return coords.map(coord => coord.join(' ')).join(', ');
		}

		// Function to convert MultiPolygon to WKT
		function multiPolygonToWkt(multiPoly) {
			return multiPoly.map(ring =>
				`MULTIPOLYGON (((${coordsToWkt(ring)})))`
			).join('; ');
		}

		// Function to convert Polygon to WKT
		function polygonToWkt(poly) {
			return `POLYGON ((${coordsToWkt(poly[0])})`;
		}

		// Convert geometries
		let wkt = '';
		geojson.features.forEach(feature => {
			if (feature.geometry.type === 'MultiPolygon') {
				wkt += multiPolygonToWkt(feature.geometry.coordinates);
			} else if (feature.geometry.type === 'Polygon') {
				wkt += polygonToWkt(feature.geometry.coordinates);
			}
		});

		return wkt;
	}

	function geojsonToWKT1(geoJson) {

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

			multiPolygonCoordinates = multiPolygonCoordinates.replace(/, , /g, ", ");

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

			const featurePromises = ids.map(async (id) => {
				const location = id.replace(/,/g, '_');
				const url = fetchurl + location + ".js";

				try {
					const response = await fetch(url);
					if (!response.ok) {
						console.error('Request failed with status:', response.status, 'for URL:', url);
						return null; // Skip if fetch fails
					}

					let jsonstr = await response.text();
					jsonstr = jsonstr.replace(/(var(:?.*)geom_(:?.*)(?:\s)\=(?:\s))+/gm, "");

					try {
						const feature = JSON.parse(jsonstr);
						return feature; // Successfully parsed JSON
					} catch (parseError) {
						console.error('Failed to parse JSON:', parseError, 'for URL:', url);
						return null;
					}
				} catch (error) {
					console.error('Error fetching data for location', location, error);
					return null; // Handle any errors in the fetch
				}
			});

			// Wait for all fetches to complete
			const featuresArray = await Promise.all(featurePromises);

			// Add features, filtering out nulls
			features.features.push(...featuresArray.filter(feature => feature !== null));
			console.log('Features added successfully:', JSON.stringify(features.features));



			console.log("features", JSON.stringify(features));

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


			return false;
		};

		//}, 3000);
	}, false);
})();