// Run this function when the user selects the report type from the Create Report or Query tab 
//function onSelectReportType(ele) {
//
//	// Find the form where the element was selected (Create Report or Query)
//	var form = $(ele).parent().parent();
//
//	// Find the hidden elements
//	var label = $(form).find(".additional_msg");
//	var select = $(form).find(".additional_msg_select");
//
//	// Set the label and select options based on the selected report type
//	switch (ele.value) {
//
//	// If the report type is donation or request:
//	// 1. Set the label text to "Resource Type"
//	// 2. Remove any existing options from the <select> element
//	// 3. Set the default value in the <select> element to "Choose the resource type"
//	// 4. Add resource options to the <select> element
//	case "donation":
//	case "request":
//
//		// Set the label text to "Resource Type"
//		label.text("Resource Type:");
//
//		// Remove any existing options from the <select> element
//		select.find('option').remove();
//
//		// Set the default value in the <select> element to "Choose the resource type"
//		select.append($("<option></option>").attr("value", "").text("Choose the resource type"));
//
//		// Add the resource values to the <select> element
//		selectValues = [ 'water', 'food', 'money', 'medicine', 'cloth', 'rescue/volunteer' ];
//
//		// Append each value to the <select> element options
//		$.each(selectValues, function(index, value) {
//			select.append($("<option></option>").attr("value", value).text(value));
//		});
//		break;
//
//	// If the report type is damage:
//	// 1. Set the label text to "Damage Type"
//	// 2. Remove any existing options from the <select> element
//	// 3. Set the title in the <select> element to "Choose the damage type"
//	// 4. Add damage options to the <select> element
//	case "damage":
//
//		// Set the label to "Damage Type"
//		label.text("Damage Type:");
//
//		// Remove any existing options from the <select> element
//		select.find('option').remove();
//
//		// Set the default value in the <select> element to "Choose the damage type"
//		select.append($("<option></option>").attr("value", "").text("Choose the damage type"));
//
//		// Add the damage values to the <select> element
//		selectValues = [ 'pollution', 'building damage', 'road damage', 'casualty', 'other' ];
//
//		// Append each value to the <select> element options
//		$.each(selectValues, function(index, value) {
//			select.append($("<option></option>").attr("value", value).text(value));
//		});
//		break;
//
//	// If no report type is selected, hide the <div> tag
//	default:
//		$(form).find(".additional_msg_div").css("visibility", "hidden");
//		return;
//	}
//
//	// Show the <div> tag
//	$(form).find(".additional_msg_div").css("visibility", "visible");
//}

// Run this function when the user clicks Submit on the Query tab
function queryReport(event) {

	// Stop the form from submitting normally,
	// so the page stays on the Query tab after the report is submitted
	event.preventDefault();

	// Construct an array with the query parameters to submit to the server
	// Each element of the array is a dictionary with two keys: "name" and
	// "value"
	// The names are the form element variables (e.g. disaster_type)
	// The values are the form element values (e.g. hurricane)
	var a = $("#query_report_form").serializeArray();

	// Add tab_id = 1 to the Ajax request to indicate a query (tab_id = 0
	// indicates a new report)
	a.push({
		name : "tab_id",
		value : "1"
	});

	// Exclude fields with blank values from the query (users may leave some
	// input fields blank)
	a = a.filter(function(item) {
		return item.value != '';
	});

	// Send the Ajax request with the form data to the server using POST
	$.ajax({
		url : 'HttpServlet',
		type : 'POST',
		data : a,

		// If the request succeeds, call the mapInitialization() function
		// to redraw the map with the reports matching the query
		success : function(reports) {
			mapInitialization(reports);
		},

		// If the request fails, display an alert popup with the error
		error : function(xhr, status, error) {
			alert("Status: " + status + "\nError: " + error);
		}
	});
}

// Register the submit event with the query_report_form tag
// Call queryReport when the user clicks Submit
$("#query_report_form").on("submit", queryReport);

// Run this function when the user clicks Submit on the Create Report tab
function createReport(event) {

	// Stop the form from submitting normally,
	// so the page stays on the Create Report tab after the report is submitted
	event.preventDefault();

	// Construct an array with the query parameters to submit to the server
	// Each element of the array is a dictionary with two keys: "name" and
	// "value"
	// The names are the form element variables (e.g. disaster_type)
	// The values are the form element values (e.g. hurricane)
	var a = $("#create_report_form").serializeArray();

	// Add tab_id = 0 to the Ajax request to indicate a new report (tab_id = 1
	// indicates a query)
	a.push({
		name : "tab_id",
		value : "0"
	});

	// Add the longitude of the selected address to the array
	a.push({
		name : "longitude",
		value : place.geometry.location.lng()
	// Change to Leaflet getLatLng()
	});

	// Add the latitude of the selected address to the array
	a.push({
		name : "latitude",
		value : place.geometry.location.lat()
	// Change to Leaflet getLatLng()
	});

	// Exclude fields with blank values from the submission (users may leave
	// some input fields blank)
	a = a.filter(function(item) {
		return item.value != '';
	});

	// Send the Ajax request with the form data to the server using POST
	$.ajax({
		url : 'HttpServlet',
		type : 'POST',
		data : a,

		// If the request succeeds, the report is submitted
		// Display an alert popup with a confirmation message
		success : function(reports) {
			alert("The report was submitted successfully");
		},

		// If the request fails, display an alert popup with the error
		error : function(xhr, status, error) {
			alert("Status: " + status + "\nError: " + error);
		}
	});

	// Make an Ajax request to query all reports in the database using POST
	$.ajax({
		url : 'HttpServlet',
		type : 'POST',
		data : {
			"tab_id" : "1" // Query tab
		},

		// If the request succeeds, call the showAllReports() function
		// to redraw the map with all the reports
		success : function(reports) {
			showAllReports(reports);
		},

		// If the request fails, display an alert popup with the error
		error : function(xhr, status, error) {
			alert("Status: " + status + "\nError: " + error);
		}
	});

	// When the Ajax request is complete, call onPlaceChanged() again
	// to update the map extent to the report that was just submitted
	$(document).ajaxComplete(function(reports) {
		onPlaceChanged();
	});

	// Reset the form
	document.getElementById("create_report_form").reset();

	// Hide the additional message <div> tag
	$(".additional_msg_div").css("visibility", "hidden");

}

// Register the submit event with the create_report_form tag
// Call createReport when the user clicks Submit
$("#create_report_form").on("submit", createReport);