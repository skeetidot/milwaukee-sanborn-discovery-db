# 1910 Sanborn Maps of Milwaukee
A mobile-friendly web mapping application for librarians and the public to interact with the 1910 Sanborn Maps of Milwaukee, developed by Belle Lipton and Lauren Winkler

Users can:
-	View the 1910 maps as a seamless dataset
-   Use the opacity slider to compare the 1910 maps with the current city landscape
-	Click a location to see nearby 1910 landmarks and access individual map sheets in the library’s collection
-	Search for a particular current address in the Milwaukee area
-   Click a building on the map and provide its historic street address, building type (dwelling, store, flat, or other), building name (e.g. Pabst Theater), a link to more information, and any other comments
-   Hover over user-contributed buildings to see the contributed information

View a demo of the app at https://www.youtube.com/watch?v=zSWXJdqJQ74. To run this app, you will need to setup a PostgreSQL database with PostGIS. See database-setup-instructions.pdf for instructions on how to setup this database in pgAdmin.

Access a search version of the site at http://webgis.uwm.edu/agsl/sanborn.

Want to use the Sanborn maps in your own application? The cached maps are available as a REST service at http://webgis.uwm.edu/arcgisuwm/rest/services/AGSL/SanbornMaps/MapServer.