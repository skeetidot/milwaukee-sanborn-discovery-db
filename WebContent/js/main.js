// DECLARE MAP IN GLOBAL SCOPE
var map;

// DECLARE DEFAULT OPACITY IN GLOBAL SCOPE
var currentOpacity = 1;

// DECLARE GLOBAL VARIABLES
var sheetBoundaries;
var historicBuildings = L.layerGroup();
var currentAddress;
var searchResultMarker;

// DECLARE GLOBAL VARIABLES FOR GEOCODING
var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider();
var geocodeService = L.esri.Geocoding.geocodeService();

// DECLARE BASEMAPS IN GLOBAL SCOPE

// GREY BASEMAP
var Esri_WorldGrayCanvas = L.tileLayer('https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	maxZoom : 16
});

// GREY BASEMAP LABELS
var Esri_WorldGrayReference = L.tileLayer('https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
	maxZoom : 16
});

// DECLARE SANBORN MAPS IN GLOBAL SCOPE
var sanborn = L.esri.tiledMapLayer({
	url : 'http://webgis.uwm.edu/arcgisuwm/rest/services/AGSL/SanbornMaps/MapServer',
	maxZoom : 21,
	minZoom : 0,
	opacity : 0.8, // Initial opacity
	attribution : 'American Geographical Society Library, University of Wisconsin-Milwaukee'
});

// WORLD IMAGERY (FOR USE AT DETAILED SCALES)
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	minZoom : 17,
	maxNativeZoom : 20,
	maxZoom : 21
});

// CREATE MARKER
// MODIFIED FROM AN ICON CREATED BY ALEX KWA, THE NOUN PROJECT
// SOURCE: https://thenounproject.com/term/map-marker/39497/
var goldMarker = L.icon({
	iconUrl : 'css/gold_marker_noun_39497_cc.svg',
	iconSize : [ 25, 41 ],
	iconAnchor : [ 12, 41 ],
	popupAnchor : [ 1, -34 ],
	shadowUrl : 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
	shadowSize : [ 41, 41 ]
});

// SET THE MAP OPTIONS
var mapOptions = {
	center : [ 43.041734, -87.904980 ], // centered in Downtown Milwaukee
	zoom : 14,
	minZoom : 11,
	maxZoom : 21,

	// panning bounds so the user doesn't pan too far away from Milwaukee
	maxBounds : L.latLngBounds([ 42.84, -87.82 ], [ 43.19, -88.07 ]),

	// Set it to false if you don't want the map to zoom beyond min/max zoom
	// and then bounce back when pinch-zooming
	bounceAtZoomLimits : false,

	// Set the layers to build into  the layer control
	layers : [ Esri_WorldGrayCanvas, sanborn, historicBuildings ]
};

// CREATE A NEW LEAFLET MAP WITH THE MAP OPTIONS
var map = L.map('map', mapOptions);

// ADD THE ZOOM CONTROL IN THE BOTTOM RIGHT CORNER
map.zoomControl.setPosition('bottomright');

// SET THE BASEMAP
// ONLY INCLUDE ONE BASEMAP SO IT IS NOT PART OF THE LAYER LIST
var baseMaps = {
	"Grayscale" : Esri_WorldGrayCanvas
};

// SET THE OVERLAYS
var overlayMaps = {
	"1910 Sanborn Maps" : sanborn,
    "Historic Buildings" : historicBuildings
// We can add the landmarks layer here when it is ready
};

// ADD THE LAYER CONTROL TO THE MAP
var toggleControls = L.control.layers(baseMaps, overlayMaps, {
	collapsed : false
// Keep the layer list open
}).addTo(map);

// WHEN SANBORNS ARE DESELECTED, HIDE OPACITY SLIDER
$(".leaflet-control-layers input:checkbox:first").change(function() {
	var ischecked = $(this).is(':checked');
	if (!ischecked)
		$('.opacity-slider').hide();
});
$(".leaflet-control-layers input:checkbox:first").change(function() {
	var ischecked = $(this).is(':checked');
	if (ischecked)
		$('.opacity-slider').show();
});

/** ***************************************************************************** */
/* JAVASCRIPT RELATED TO SETTING UP THE OPACITY SLIDER */
(function() {

	// CREATE A LEAFLET CONTROL OBJECT AND STORE A REFERENCE TO IT IN A VARIABLE
	var sliderControl = L.control({
		position : 'topright',
		bubblingMouseEvents : false
	});

	// WHEN WE ADD THIS CONTROL OBJECT TO THE MAP
	sliderControl.onAdd = function(map) {

		// SELECT AN EXISTING DOM ELEMENT WITH AN ID OF 'OPACITY-SLIDER'
		var slider = L.DomUtil.get("opacity-slider");

		// WHEN THE USER HOVERS OVER THE SLIDER ELEMENT
		L.DomEvent.addListener(slider, 'mouseover', function(e) {
			// PREVENT THE USER FROM DRAGGING THE MAP WHILE THEY ARE HOVERING ON
			// THE OPACITY SLIDER
			map.dragging.disable();
		});

		// WHEN THE USER CLICKS ON THE SLIDER ELEMENT
		L.DomEvent.addListener(slider, 'mouseout', function(e) {
			// ALLOW THE USER TO DRAG THE MAP WHEN THEY MOVE OFF OF THE OPACITY
			// SLIDER
			map.dragging.enable();
		});

		// RETURN THE SLIDER FROM THE ONADD METHOD
		return slider;
	};

	// ADD THE CONTROL OBJECT CONTAINING THE SLIDER ELEMENT TO THE MAP
	sliderControl.addTo(map);

})();
// END OF OPACITY SLIDER JAVASCRIPT

function touchHandler(event) {
	var touch = event.changedTouches[0];

	var simulatedEvent = document.createEvent("MouseEvent");
	simulatedEvent.initMouseEvent({
		touchstart : "mousedown",
		touchmove : "mousemove",
		touchend : "mouseup"
	}[event.type], true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);

	touch.target.dispatchEvent(simulatedEvent);
	event.preventDefault();
}

function init() {
	document.addEventListener("touchstart", touchHandler, true);
	document.addEventListener("touchmove", touchHandler, true);
	document.addEventListener("touchend", touchHandler, true);
	document.addEventListener("touchcancel", touchHandler, true);
}

/** ***************************************************************************** */
/* CALL GET DATA FUNCTION */
getData(map);

// FUNCTION TO RETRIEVE DATA AND PLACE IT ON THE MAP (:
function getData(map) {

	// ADD THE BASEMAPS
	map.addLayer(Esri_WorldGrayCanvas);
	map.addLayer(Esri_WorldGrayReference);
	map.addLayer(Esri_WorldImagery);

	// ADD THE SANBORNS
	sanborn.addTo(map);
    
    // ADD THE HISTORIC BUILDINGS FROM THE DATABASE
    showAllBuildings();

	// CALL THE UPDATEOPACITY() FUNCTION TO UPDATE THE MAP AS THE USER MOVES THE
	// YEAR SLIDER
	updateOpacity(sanborn, currentOpacity);

	/** ***************************************************************************** */
	/* JAVASCRIPT RELATED TO SEARCH BAR AND GEOCODING */

	/*
	 * SEARCH BAR (BETA VERSION -- EXPLORING BEST ROUTE TO TAKE) ADD ESRI
	 * LEAFLET SEARCH CONTROL
	 */
	var searchControl = document.getElementById('search');

	// CREATE THE GEOCODING CONTROL AND ADD IT TO THE MAP
	searchControl = L.esri.Geocoding.geosearch({

		// KEEP THE CONTROL OPEN
		expanded : true,

		// LIMIT SEARCH TO MILWAUKEE COUNTY
		searchBounds : L.latLngBounds([ 42.84, -87.82 ], [ 43.19, -88.07 ]),

		// KEEP THE CONTROL OPEN AFTER GETTING RESULTS
		collapseAfterResult : false,

		// REQUIRE USERS TO SELECT ONE RESULT
		allowMultipleResults : false,

		// USE ARCGIS ONLINE AS A DATA PROVIDER
		// LOOK INTO A SECOND PROVIDER WITH THE BUSINESSES FROM THE SHEET
		// BOUNDARIES
		providers : arcgisOnline

	}).addTo(map);

	// CREATE AN EMPTY LAYER GROUP TO STORE THE RESULTS AND ADD TO MAP
	var results = L.layerGroup().addTo(map);

	/** ***************************************************************************** */
	/*
	 * TO BE EVALUATED. EITHER GET A BETTER GEOCODER, OR DON'T ADD POINT LISTEN
	 * FOR RESULTS EVENT AND ADD EVERY RESULT TO THE MAP
	 */
	searchControl.on("results", function(data) {

		// IF THERE IS AN EXISTING SEARCH RESULT MARKER, REMOVE IT
		if (searchResultMarker != null) {
			searchResultMarker.remove();
		}

		// LOOP THROUGH ALL SEARCH RESULTS
		for (var i = data.results.length - 1; i >= 0; i--) {

			// CREATE A MARKER AT THE RESULT AND ADD IT TO THE MAP
			searchResultMarker = L.marker(data.results[i].latlng, {
				icon : goldMarker
			});
			searchResultMarker.addTo(map);

			// BUILD A POPUP WITH THE RESULT ADDRESS AND OPEN IT
			searchResultMarker.bindPopup(data.results[i].text);
			searchResultMarker.openPopup();

			// REMOVE THE MARKER AND POPUP WHEN THE POPUP CLOSES
			searchResultMarker.on('popupclose', function(e) {
				searchResultMarker.remove();
			});

		}
	});

	/** ***************************************************************************** */
	/*
	 * JAVASCRIPT TO HIDE SEARCH BAR WHEN POPUPS ARE ENABLED IN MOBILE
	 * DEFINITELY NOT PERFECT, CAN BE SLEEKER IN LATER ITERATIONS. IF SEARCH BAR
	 * CODE CHANGES, JUST REPLACE .GEOCODER-CONTROL-INPUT WITH THE DIV CLASS OF
	 * THE NEW SEARCH BAR (WHICH YOU CAN FIND BY LOOKING WITH THE CHROME
	 * INSPECTOR)
	 */
	if ($(window).width() < 600) {
		map.on('popupopen', function(e) {
			$('.geocoder-control-input').hide();
		});
		map.on('popupclose', function(e) {
			$('.geocoder-control-input').show();
		});
	}
    
    
    /* SHOW ALL HISTORIC BUILDINGS FROM THE DATABASE */
    function showAllBuildings() {
        
        // Make an Ajax request to query all buildings in the database using POST
        $.ajax({
            url: 'SanbornServlet',
            type: 'POST',
            data: {
                "tab_id": "1" // Query
            },

            // If the request succeeds, a JSON list of buildings is returned in the HTTP response
            // Pass the JSON list to the success function to add markers at the building locations
            success: function (buildings) {
                
                // For each building:
                // 1. Get the coordinates for the building location
                // 2. Update the map bounds to include the building location
                // 3. Create a new marker at the building location
                $.each(buildings, function (i, e) {
                    
                    // Get the coordinates for the building location
                    var lng = Number(e.longitude);
                    var lat = Number(e.latitude);
                    
                    // Create a LatLng object with the building location
                    var latlng = L.latLng(lat, lng);
                    
                    // Create a marker at the building location and
                    // add it to the historicBuildings layer group
                    var buildingMarker = L.circleMarker(latlng, {
                        fillColor: '#FFBD00', // gold
                        fillOpacity: 1, // 100% opacity
                        color: '#231F20', // stroke color, almost black
                        weight: 1.25, // stroke weight
                        opacity: 1, // 100% stroke opacity
                        radius: 6
                    });
                    
                    // Initialize a variable to store the tooltip
                    var tooltip;
                    
                    // Get the building attributes
                    var hist_addr = e.hist_addr;
                    var build_code = e.build_code;
                    var designation = e.designation;
                    
                    // Build the tooltip with the historic address, building code, and building designation (building name)
                    
                    // Add the designation, if any
                    if (designation != '') {
                        tooltip = "<b>" + designation + "</b><br>";
                    }                    
                    
                    // Add the historic address, if any
                    if (hist_addr != '') {
                        tooltip = tooltip + hist_addr + "<br>";
                    }
                    
                    // Add the building code, if any
                    if (build_code == 'D' || build_code == 'Dwelling') {
                        tooltip = tooltip + "Dwelling (D)" + "<br>";
                    }
                    else if (build_code == 'S' || build_code == 'Store') {
                        tooltip = tooltip + "Store (S)" + "<br>";
                    }                    
                    else if (build_code == 'F' || build_code == 'Flat') {
                        tooltip = tooltip + "Flat (F)" + "<br>";
                    }                    
                    else if (build_code != '') {
                        tooltip = tooltip + "Other Building Code" + "<br>";
                    }                    

                    
                    // Show a message if there is no information in any of the fields
                    if (tooltip == '') {
                        tooltip = "No building information";
                    }
                    
                    // Bind the tooltip to the building marker                    
                    buildingMarker.bindTooltip(tooltip).addTo(map);
                    
                    // When the user hovers over the building marker, display the tooltip
                    buildingMarker.on('mouseover', function(e) {
                        buildingMarker.openTooltip();
                    });
                    
                    // When the user hovers off of the building marker, hide the tooltip
                    buildingMarker.on('mouseout', function(e) {
                        buildingMarker.closeTooltip();
                    });                    

                    // Add the building marker to the historic buildings layer
                    buildingMarker.addTo(historicBuildings);
                    
                });
                
                // Add the historicBuildings layer group to the map
                historicBuildings.addTo(map);
            
            },
                       
            // If the request fails, display an alert popup with the error
            error: function (xhr, status, error) {
                alert("An Ajax error occurred: " + status + "\nError: " + error);
            }
        });   
        
        
        
    }

	/** ***************************************************************************** */
	// USE JQUERY'S GETJSON() METHOD TO LOAD THE SHEET BOUNDARY DATA
	// ASYNCHRONOUSLY
	$.getJSON("data/boundaries_mercator.json", function(data) {

		// CREATE A LEAFLET GEOJSON LAYER FOR THE SHEET BOUNDARIES WITH POPUPS
		// AND ADD TO THE MAP
		sheetBoundaries = L.geoJson(data, {

			// CREATE STYLING FOR THE BOUNDARY LAYER
			style : function(feature) {
				return {
					color : '#585858', // Stroke Color
					weight : 2, // Stroke Weight
					fillOpacity : 0, // Override the default fill opacity
					opacity : 0 // Border opacity
				};
			},

			// LOOP THROUGH EACH FEATURE AND CREATE A POPUP
			onEachFeature : function(feature, layer) {
				layer.on('click', function(e) {
					buildPopupContent(feature, layer, e);
					addMarker(e);
				});
			}
		}).addTo(map);

	});

	/** ***************************************************************************** */
	/* POPULATE THE POPUP USING ATTRIBUTES FROM THE GEOJSON BOUNDARY DATA */
	function buildPopupContent(feature, layer, e) {

		/** ***************************************************************************** */
		/* COMMENTED OUT REVERSE GEOCODER STUFF */
		// geocodeService.reverse().latlng(e.latlng).run(function (error,
		// result) {
		// /* CALLBACK IS CALLED WITH ERROR, RESULT & RAW RESPONSE
		// RESULT.LATLNG CONTAINS THE COORDINATES OF THE LOCATED ADDRESS
		// RESULT.ADDRESS CONTAINS INFORMATION ABOUT THE MATCH
		// */
		// BUILD A POPUP WITH THE MATCH ADDRESS (BUSINESS NAME AND ADDRESS)
		// currentAddress = "<div class='item-key'><b>Current Address:</b></div>
		// <div class='item-value'>" + result.address.LongLabel + "</div>";
		// });
		// var popupCurrentSubheading = "<div class='item-key'><b>THIS LOCATION
		// TODAY</b></div>"
		// var popupHistoricSubheading = "<div class='item-key'><b>THIS LOCATION
		// IN 1910</b></div>"
		/** ***************************************************************************** */
		
		/* GET THE FEATURES FROM THE GEOJSON AND ADD THEM TO A POPUP */
		var sheetname = "<div class= 'item-key'><b>Sheet Number:</b></div> <div class='item-value'>" + feature.properties.Sheet_Numb + "</div>";
		var businesses = '';
		for ( var business in feature.properties) {
			var value = feature.properties.Business_P;
			if (value !== null) {
				businesses = "<div class= 'item-key' id = 'business'><b>Nearby Landmarks in 1910: </b></div><div class='item-value'>" + feature.properties.Business_P + "</div>";
			}
		}
		var repository = "<div class= 'item-key'><b>Repository: </b></div><div class='item-value'>" + feature.properties.Repository + "</div>";
		var view = "<div class= 'item-link'>" + '<a href="' + feature.properties.Reference + '" target= "_blank">' + 'View in UWM Digital Collections</a></div>';
		var makeHistoryButton = "<div class = 'makeHistoryText'>Add information about historic building:</div>";
		var hint = "<div id = 'hint'>Hint: make sure the marker is placed directly on the building and zoom in to see the building details.</div>";

		/* BUILD THE FORM ELEMENTS */
		var linespace = `<br>`;
		var html1 = `<form id='contribute-history-form' role='form'>`;
		var html2 = `<div class="form-group">`;
		var html3 = `<label>Historic Street Address:</label>`;
		var html4 = `<input type='text' name='hist_addr' id='historicAddress'>`;
		var html5 = `</div>`;
		var html6 = `<div class="form-group">`;
		var html7 = `<label>Building Type:<br><i>(D = Dwelling, F = Flat, S = Store,<br>no marking = Other)</i></label>`;
		var html8 = `<input type='text' name='build_code' id='buildingCode'>`;
		var html12 = `</div>`;
		var html13 = `<div class="form-group">`;
		var html14 = `<label>If provided, please enter the title of the building on the map: <br><p>(e.g. Pabst Theater, Street Car Barn, Bowling Alley, etc.)</p></label>`;
		var html15 = `<input type='text' name='designation' id='designation'>`;
		var html16 = `</div>`;
		var html17 = `<div class="form-group">`;
		var html18 = `<label>Link to article or blog related to the history of this property:</label>`;
		var html19 = `<input type='text' name='hist_blogs' id='historicBlogs'>`;
		var html20 = `</div>`;
		var html21 = `<div class="form-group">`;
		var html22 = `<label>Tell us something about this property:</label>`;
		var html23 = `<input type='text' name='comments' id='comments'>`;
		var html24 = `<div class="form-group">`;
		var html25 = `<button type='submit' id='submit' value='submit'>Submit</button>`;
		var html26 = `</div>`;
		var html27 = `</form>`;

		var formstatement = (linespace + html1 + html2 + html3 + html4 + html5 + linespace + html6 + html7 + html8 + html12 + linespace + html13 + html14 + html15 + html16 + linespace + html17 + html18 + html19 + html20 + linespace+ html21 + html22 + html23 + linespace + html24 + html25 + html26 + html27);

		/* WHEN THE USER CLICKS SUBMIT IN THE POPUP */
		$(document).delegate('#submit', 'click', function(event) {
			
			/*
			 * Stop the form from submitting normally, so the submission
			 * can interact with the servlet
			 */ 
			event.preventDefault();

			/*
			 * Construct an array with the data entered into the form to submit
			 * to the server Each element of the array is a dictionary with two
			 * keys: "name" and "value" The names are the field names (e.g.
			 * hist_addr) The values are the values entered in the form (e.g.
			 * 123 Any St)
			 */
			var dataArray = $("#contribute-history-form").serializeArray();

			/*
			 * Add tab_id = 0 to the array to indicate a new record
			 * (tab_id = 1 indicates a query)
			 */ 
			dataArray.push({
				name : "tab_id",
				value : "0"
			});

			// Add the longitude of the selected building to the array
			dataArray.push({
				name : "longitude",
				value : e.latlng.lng
			});

			// Add the latitude of the selected building to the array
			dataArray.push({
				name : "latitude",
				value : e.latlng.lat
			});

			console.log(dataArray);

			/*
			 * Send the Ajax request with the form data to the servlet using
			 * POST. If the request is successful, reset the form. If the
			 * request fails, display an error message.
			 */
			$.ajax({
				url : 'SanbornServlet',
				type : 'POST',
				data : dataArray,
				success : function(reports) {
                    
                    // Display a confirmation message
					alert("Thank you for your contribution.");
                    
                    // Reset the form
					document.getElementById("contribute-history-form").reset();
                    
                    // Close the popup
                    sheetBoundaries.closePopup();
                    
                    // Show all historic buildings from the database
                    showAllBuildings();
                    
                },
				error : function(xhr, status, error) {
					alert("An Ajax error occurred: " + status + "\nError: " + error);
				}
			});

            
		});

		/* DEFINE THE POPUP CONTENT */
		var info = (sheetname + businesses + view + makeHistoryButton + hint + formstatement);

		/*
		 * PUSH INFO TO POPUP USING RESPONSIVE POPUP PLUGIN SO THAT POPUPS ARE
		 * CENTERED ON MOBILE EVALUATE EFFICACY OF THIS PLUGIN -- IS THERE
		 * SOMETHING MORE EFFECTIVE OUT THERE?
		 */
		var popup = L.responsivePopup().setContent(info);

		/* BIND THE POPUP CONTENT TO THE SHEET BOUNDARY AND OPEN THE POPUP */
		sheetBoundaries.bindPopup(popup, {
			offset : new L.Point(80, 80)
		}).openPopup();
	}

	/* ADD A MARKER TO THE MAP AT THE CLICKED LOCATION */
	function addMarker(e) {
		// Add marker to map at click location; add popup window
		var newMarker = new L.marker(e.latlng, {
			icon : goldMarker
		}).addTo(map);
		
		map.on('popupclose', function(e) {
			map.removeLayer(newMarker);
		});
	}

	/** *************************************************************************** */
	/*
	 * JAVASCRIPT RELATED TO UPDATING THE HISTORIC MAPS WHEN OPACITY SLIDER IS INITIATED
	 */
	function updateOpacity(sanborn, currentOpacity) {

		// Select the slider div element
		$('.opacity-slider')

		// When the user updates the slider
		.on('input change', function() {

			// Determine the current opacity
			currentOpacity = Number($(this).val()) / 100;

			// Change the opacity of the Sanborn maps to the current opacity
			sanborn.setOpacity(currentOpacity);

		});

	} // BRACKET CLOSING UPDATE OPACITY
	// WHATEVER FUNCTION IS LAST PLEASE ADD COMMENT DENOTING END OF FUNCTION
	// THIS IS WHERE IT CAN GET CONFUSING

} // BRACKET CLOSING THE GETDATA FUNCTION

/********************************************************************************/
/* JAVASCRIPT RELATED TO OPENING AND CLOSING THE DATA AND ABOUT INFORMATION WINDOWS */

// GET THE MODALS
var aboutModal = document.getElementById('about-modal');

// GET THE IDS OF THE BUTTONS THAT OPEN THE MODALS
var aboutBtn = document.getElementById("about-button");



// GET THE <SPAN> ELEMENT THAT CLOSES THE MODAL
var aboutSpan = document.getElementsByClassName("close-about")[0];

// WHEN THE USER CLICKS ON THE BUTTONS, OPEN EITHER MODAL
aboutBtn.onclick = function () {
    aboutModal.style.display = "block";
};

// WHEN THE USER CLICKS ON THE <SPAN> (X), CLOSE THE MODAL
aboutSpan.onclick = function () {
    aboutModal.style.display = "none";
};



// *************************************END OF MAIN.JS***********************************/