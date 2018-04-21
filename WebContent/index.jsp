<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>

<!DOCTYPE html>
<html lang="en">

<head>

    <!-- BOILERPLATE HTML -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!--<meta name="viewport" content="width=device-width, initial-scale=1">-->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
    <!--320-->
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <title>1910 Milwaukee</title>


    <!-- LINKS TO STYLE SHEETS -->
    <link rel="stylesheet" href="lib/leaflet/leaflet.css">
    <link href="css/style.css" rel="stylesheet">

    <!-- LEAFTLET JS -->
    <!-- Needs to go after Leaflet CSS -->
    <script src="https://unpkg.com/leaflet@1.3.1/dist/leaflet.js" integrity="sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw==" crossorigin=""></script>
    <script type="text/javascript" src="lib/leaflet/leaflet.js"></script>
    <script type="text/javascript" src="lib/leaflet/leaflet-src.js"></script>



    <!-- GOOGLE MAPS API & GEOSEARCH JS (FOR SEARCHING ADDRESSES) -->
    <!--
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBo-ggpJr485oHzwkfLkI-j8t6Z1nTrDV0&libraries=places"></script>
    <script type="text/javascript" src="lib/geosearch/geosearch.js"></script>
-->



    <!-- RESPONSIVE POPUP PLUGIN (MAKES POPUPS CENTER CORRECTLY ON MOBILE) -->
    <script src="https://unpkg.com/leaflet-responsive-popup@0.2.0/leaflet.responsive.popup.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-responsive-popup@0.2.0/leaflet.responsive.popup.css" />

    <!-- ESRI LEAFLET -->
    <script src="https://unpkg.com/esri-leaflet@2.1.3/dist/esri-leaflet.js" integrity="sha512-pijLQd2FbV/7+Jwa86Mk3ACxnasfIMzJRrIlVQsuPKPCfUBCDMDUoLiBQRg7dAQY6D1rkmCcR8286hVTn/wlIg==" crossorigin=""></script>

    <!-- ESRI LEAFLET GEOCODER -->
    <link rel="stylesheet" href="https://unpkg.com/esri-leaflet-geocoder@2.2.9/dist/esri-leaflet-geocoder.css">
    <script src="https://unpkg.com/esri-leaflet-geocoder@2.2.8"></script>

    <!-- JQUERY -->
    <script type="text/javascript" src="lib/jquery/jquery-3.1.1.js"></script>

    <!--<! &#45;&#45; TOUCH EVENT LIBRARY &ndash;&gt;-->
    <!--<script src="//rawgit.com/ngryman/jquery.finger/v0.1.2/dist/jquery.finger.js"></script>-->

    <!-- PROJ4 & PROJ4LEAFLET-->
    <script src="https://unpkg.com/proj4@2.4.3"></script>
    <script src="https://unpkg.com/proj4leaflet@1.0.1"></script>


</head>

<body>

    <!-- MAP -->
    <div class="custom-popup" id="map"></div>

    <!-- SEARCH BOX -->
    <div id="geocoder-control-input" type="text" placeholder="Search for an address" autocomplete="true"></div>

    <!-- HEADER TITLE -->
    <div id="title">
        <h1>SANBORN MAPS OF MILWAUKEE </h1>
    </div>

    <div id="mobile-title">
        <h1>SANBORN MAPS <br> MILWAUKEE</h1>
    </div>


    <!-- OPACITY SLIDER -->
    <div id="opacity-slider">
            <input type="range" min="0" max="100" value="80" step="1" class="opacity-slider" title="Click and drag the slider to change the opacity of the historic maps">
    </div>


    MAKE HISTORY
    <div id ="make-history-box">
		<div id = "options">
		<p>Click on a building to:</p>
			<li>Get library information &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;about the map sheet</li>
			<br>
			<li>Contribute historic &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;information about the &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;building</li>
		</div>
    </div>



    <!-- NAVBAR LINKS-->
    <div id="top-buttons">
        <div class="mobile-buttons">
            <div id="data-button">Data</div>
            <div id="about-button">About</div>
        </div>
    </div>
    

    <!-- ABOUT MODAL -->
    <div id="about-modal" class="modal">
        <!-- ABOUT MODAL CONTENT -->
        <div class="modal-content">
            <span class="close-about">&times;</span>
            <p>Placeholder element for development. </p>
            <p>Information about Sanborns, AGSL & project will go here.</p>
            <p>Marker based on a design created by Alex Kwa from the Noun Project</p>
        </div>
    </div>
    <!-- ABOUT MODAL ENDS HERE (THESE ARE GOING TO BE LONG) -->


    <!-- DATA MODAL -->
    <div id="data-modal" class="modal">
        <!-- ABOUT MODAL CONTENT -->
        <div class="modal-content">
            <span class="close-data">&times;</span>
            <p>Placeholder element for development. </p>
            <p>Information about community-generated GIS data will go here.</p>
            <p>We want to know what you want to tell us about your city.</p>
        </div>
    </div>
    <!-- DATA MODAL ENDS HERE (THESE ARE GOING TO BE LONG) -->


    <!-- LINK TO MAIN JAVASCRIPT-->
    <script type="text/javascript" src="js/main.js"></script>
    
	<!-- Load JavaScript -->
	<script src="js/loadform.js"></script>
	<script src="js/loadmap.js"></script>    


</body>

</html>