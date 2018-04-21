// Create a global variable to store the map object
var map;

// Create a global place object to store the place selected in the autocomplete list
var place;

// Create a global Autocomplete object
var autocomplete;

// Create a global InfoWindow object to store the info for the current marker
//var infowindow = new google.maps.InfoWindow();
console.log("loadmap.js");

// Call showAllReports() and initAutocomplete()
function initialization() {
    //showAllReports();
    //initAutocomplete();
}

// Make an Ajax request to query all reports in the database
// If the request is successful, initialize the map and add markers at the report locations
function showAllReports() {
	
	// Make an Ajax request to query all reports in the database using POST
    $.ajax({
        url: 'SanbornServlet',
        type: 'POST',
        data: {
            "tab_id": "1" // Query tab
        },
        
        // If the request succeeds, a JSON list of reports is returned in the HTTP response
        // Pass the JSON list to the mapInitialization() function to initialize the map
        // and add markers at the report locations
        success: function (reports) {
        	//mapInitialization(reports);
        },
        // If the request fails, display an alert popup with the error
        error: function (xhr, status, error) {
            alert("An Ajax error occurred: " + status + "\nError: " + error);
        }
    });
}

// Initialize the map and create markers at the report locations
// TODO: Update for Sanborn site or remove
function mapInitialization(reports) {
	
	// Define map options
    var mapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP, // Display the political basemap
    };

    // Render the map within the empty map-canvas <div> with the specified map options
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // Find the map bounds that all reports are within
    var bounds = new google.maps.LatLngBounds();

    // For each report:
    // 1. Get the coordinates for the report location
    // 2. Update the map bounds to include the report location
    // 3. Create a new marker at the report location
    $.each(reports, function (i, e) {
    	
    	// Get the coordinates for the report location
        var long = Number(e['longitude']);
        var lat = Number(e['latitude']);
        
        // Create a LatLng object with the report location
        var latlng = new google.maps.LatLng(lat, long);

        // Extend the map bounds to include the latest report location
        bounds.extend(latlng);
        
        // ---- Create the info window content as HTML ----
        
        // Set the info window title, separated with an <hr> breakline
        var contentStr = '<h4>Report Details</h4><hr>';
        
        // Add the disaster type to the info window
        contentStr += '<p><b>' + 'Disaster' + ':</b>&nbsp;' + e['disaster'] + '</p>';
        
        // Add the report type to the info window
        contentStr += '<p><b>' + 'Report Type' + ':</b>&nbsp;' + e['report_type'] + '</p>';
        
        // If the report type is request or donation, add the resource type to the info window
        if (e['report_type'] == 'request' || e['report_type'] == 'donation') {
            contentStr += '<p><b>' + 'Resource Type' + ':</b>&nbsp;' + e['resource_or_damage'] + '</p>';
        }
        
        // Otherwise, if the report type is damage, add the damage type to the info window
        else if (e['report_type'] == 'damage') {
            contentStr += '<p><b>' + 'Damage Type' + ':</b>&nbsp;' + e['resource_or_damage'] + '</p>';
        }
        
        // Add the reporter's first name and last name to the info window
        contentStr += '<p><b>' + 'Reporter' + ':</b>&nbsp;' + e['first_name'] + " " + e['last_name'] + '</p>';
		        
		// Add the time the report was created to the info window, with precision to seconds
		contentStr += '<p><b>' + 'Timestamp' + ':</b>&nbsp;' + e['time_stamp'].substring(0, 19) + '</p>';
        
		// If the report has an additional message, add it to the info window
		if ('message' in e) {
			contentStr += '<p><b>' + 'Message' + ':</b>&nbsp;' + e['message'] + '</p>';
		}
        
        // Define map icons
        // Icon source: https://mapicons.mapsmarker.com/
        var icons = {
        	request: {
        		icon: "img/request.png"    		
        	},
        	damage: {
        		icon: "img/damage.png"   
        	},
        	donation: {
        		icon: "img/donation.png"   
        	}
        }

        // Create a new marker at the report location
        // Assign the HTML content as a custom info window
        // Set the icon based on the report type
        var marker = new google.maps.Marker({ // Set the marker
            position: latlng, // Position marker at the coordinates
            map: map, // Assign the marker to the map
            customInfo: contentStr, // Assign the HTML content as a custom info window
            icon: icons[e['report_type']].icon // Set the icon based on the report type
        });
        
        // Add a click event listener to the marker
        // If the user clicks a marker, set its info window content and display its info window
        google.maps.event.addListener(marker, 'click', function () {
        	
        	// Set the info window content to the customInfo marker setting
            infowindow.setContent(marker['customInfo']); 
            
            // Open the info window
            infowindow.open(map, marker); 
        });

    });

    // Update the map extent to the updated bounds
    map.fitBounds(bounds);

}

// Initialize the autocomplete object
// When the user selects an address or place from the dropdown, show it as the selected place
function initAutocomplete() {
	
	// Create the autocomplete object and bind it to the <input> element named "autocomplete"
	autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'));
	
	// Register an event listener for the place change
	// When the user selects an address from the dropdown, call onPlaceChanged() to show the selected place
	autocomplete.addListener('place_changed', onPlaceChanged);
}

// When the user selects a place, zoom to it on the map
//TODO: Update for Sanborn site or remove
function onPlaceChanged() {
	
	// Store the current selected place
	place = autocomplete.getPlace();
	
	// If the user just added a place
	if (place !== undefined) {
		
		// If the user entered a place that was not selected, the place has no geometry. Display an error.
		if (!place.geometry) {
			// User entered the name of a place that was not suggested and
			// pressed the Enter key, or the place details request failed.
			window.alert("No details available for input: '" + place.name + "'");
			return;
		}
		
		// If the user selected a place from the list, the place has a geometry. Present it on a map.
		// If the place has a viewport, update the map extent to the viewport of the selected place
	    if (place.geometry.viewport) {
	    	map.fitBounds(place.geometry.viewport);
	    }
	    
	    // If the place does not have a viewport, update the map extent to the selected place's location
	    // and set the zoom level to 17 (1:9028)
	    else {
	    	map.setCenter(place.geometry.location);
	    	map.setZoom(17);
	    }
	    
	} 

}

// Execute the initialization function once the page has loaded
// google.maps.event.addDomListener(window, 'load', initialization);

// Call the initialization function when the user clicks the Query tab
//TODO: Update for Sanborn site or remove
$("[href='#query_report']").on("click", function() {
	initialization();
});