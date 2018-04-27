package edu.sanborn.makehistoryservlet;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.json.JSONException;
import org.json.JSONArray;

import edu.sanborn.makehistoryservlet.SanbornServlet;
import edu.sanborn.makehistoryservlet.TalkToDB;

/**
 * Servlet implementation class HttpServlet
 */
@WebServlet("/SanbornServlet")
public class SanbornServlet extends javax.servlet.http.HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see javax.servlet.http.HttpServlet#javax.servlet.http.HttpServlet()
	 * 
	 * Constructor
	 */
	public SanbornServlet() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 * response)
	 *
	 * Execute an HTTP request via GET. This method is not used in this application,
	 * since GET restricts data length and is less secure
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 * response)
	 * 
	 * Execute an HTTP request via POST
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		/*
		 * Use the request object to get the values of parameters sent from the web
		 * client and store them as a String. The getParameter() method gets a key and
		 * returns its value.
		 */
		String tab_id = request.getParameter("tab_id");

		/*
		 * Create a report
		 * 
		 * If tab_id = 0, the report is submitted to the servlet from the web client.
		 * Pass the request and response objects to the createReport() method to handle
		 * the request and create the report.
		 */
		if (tab_id.equals("0")) {
			System.out.println("A contribution is submitted!");
			try {
				createReport(request, response);
			}
			catch (SQLException e) {
				e.printStackTrace();
			}
		}

		/*
		 * Query reports
		 * 
		 * If tab_id = 1, the request is to query reports in the database. Pass the
		 * request and response objects to the queryReport() method to handle the
		 * request and query the report.
		 */
		else if (tab_id.equals("1")) {
			try {
				queryReport(request, response);
			}
			catch (JSONException e) {
				e.printStackTrace();
			}
			catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}

	/*
	 * Create a new record in the historic buildings table
	 */
	private void createReport(HttpServletRequest request, HttpServletResponse response)
			throws SQLException, IOException {

		// Run the constructor to create a new database utility object
		TalkToDB talktodb = new TalkToDB();

		// Initialize a string to store the SQL
		String sql;

		// Get the historic building information to be submitted to the database

		// Get data from the POST request and store it in String variables
		// The variable names match the database field names
		String hist_addr = request.getParameter("hist_addr");
		String build_code = request.getParameter("build_code");
		String designation = request.getParameter("designation");
		String hist_blogs = request.getParameter("hist_blogs");
		String comments = request.getParameter("comments");
		String longitude = request.getParameter("longitude");
		String latitude = request.getParameter("latitude");

		/*
		 * If any value is not null, add single quotes to be used in the SQL statement
		 * when the values will be imported into the database
		 */
		if (hist_addr != null) {
			hist_addr = "'" + hist_addr + "'";
		}
		else {
			hist_addr = "";
		}

		if (build_code != null) {
			build_code = "'" + build_code + "'";
		}
		else {
			build_code = "";
		}

		if (designation != null) {
			designation = "'" + designation + "'";
		}
		else {
			designation = "";
		}		

		if (hist_blogs != null) {
			hist_blogs = "'" + hist_blogs + "'";
		}
		else {
			hist_blogs = "";
		}		

		if (comments != null) {
			comments = "'" + comments + "'";
		}
		else {
			comments = "";
		}		

		// Build the SQL string to INSERT the record into the historicbuildings table
		sql = "INSERT INTO historicbuildings (hist_addr, build_code, designation , hist_blogs, comments, geom"
				+ ") VALUES (" + hist_addr + "," + build_code + "," + designation + "," + hist_blogs + ","
				+ comments + ", ST_GeomFromText('POINT(" + longitude + " " + latitude + ")', 4326)" + ")";

		System.out.println("Create Record SQL :" + sql);

		// Call modifyDB() to run the SQL query to insert the record
		talktodb.modifyDB(sql);

		System.out.println("Success! Historic building information entered.");

		// Return a response that the record was successfully created
		JSONObject data = new JSONObject();
		try {
			data.put("status", "success");
		}
		catch (JSONException e) {
			e.printStackTrace();
		}
		response.getWriter().write(data.toString());
	}

	/*
	 * Query the records that have been created in the database and return the
	 * results as a JSON object
	 */
	private void queryReport(HttpServletRequest request, HttpServletResponse response)
			throws JSONException, SQLException, IOException {

		// Create a JSONArray list to store the reports returned by the query
		JSONArray list = new JSONArray();

		// Initialize a string to store the SQL
		String sql;

		// Query the records and use queryReportHelper() to add the results to the
		// JSONArray
		sql = "SELECT hist_addr, build_code, designation, hist_blogs,"
			+ "ST_X(geom) as longitude, ST_Y(geom) as latitude, comments "
			+ "FROM historicbuildings";
		
		// Run the constructor to create a new database utility object
		TalkToDB talktodb = new TalkToDB();		

		// Query the database to find all records matching the SQL query
		ResultSet res = talktodb.queryDB(sql);

		// While there are records in the ResultSet, add them to the JSONArray response
		// object
		while (res.next()) {

			// Create a new HashMap list to store the attributes of each record
			HashMap<String, String> m = new HashMap<String, String>();

			// Add values to the HashMap list
			m.put("hist_addr", res.getString("hist_addr"));
			m.put("build_code", res.getString("build_code"));
			m.put("designation", res.getString("designation"));
			m.put("hist_blogs", res.getString("hist_blogs"));
			m.put("latitude", res.getString("latitude"));
			m.put("longitude", res.getString("longitude"));			
			m.put("comments", res.getString("comments"));

			// Add the HashMap list to the JSONArray response list
			list.put(m);

		}

		// Return the response
		response.getWriter().write(list.toString());


	}

	public void main() throws JSONException {
	}
}