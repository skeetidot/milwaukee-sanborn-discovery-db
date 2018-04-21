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
		// TODO Auto-generated constructor stub
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
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			catch (SQLException e) {
				// TODO Auto-generated catch block
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

		// Initialize a variable to store the ID
		int building_id = 0;

		// Get the historic building information to be submitted to the database

		// Get data from the POST request and store it in String variables
		String historicAddress = request.getParameter("historicAddress");
		String buildingCode = request.getParameter("buildingCode");
		String designation = request.getParameter("designation");
		String historicBlogs = request.getParameter("historicBlogs");
		String comments = request.getParameter("comments");

		/*
		 * If any value is not null, add single quotes to be used in the SQL statement
		 * when the values will be imported into the database
		 */
		if (historicAddress != null) {
			historicAddress = "'" + historicAddress + "'";
		}

		if (buildingCode != null) {
			buildingCode = "'" + buildingCode + "'";
		}

		if (designation != null) {
			designation = "'" + designation + "'";
		}

		if (historicBlogs != null) {
			historicBlogs = "'" + historicBlogs + "'";
		}

		if (comments != null) {
			comments = "'" + comments + "'";
		}

		// Build the SQL string to INSERT the record into the historicbuildings table
		sql = "INSERT INTO historicbuildings (building_id, hist_addr, build_code, designation , hist_blogs, comments"
				+ ") VALUES ('" + building_id + ", " + historicAddress + "," + buildingCode + "," + designation + ","
				+ historicBlogs + "," + comments + ")";

		System.out.println("Create Record SQL :" + sql);

		// Call modifyDB() to run the SQL query to insert the record
		talktodb.modifyDB(sql);

		// Get the next integer to be the building ID
		ResultSet res = talktodb.queryDB("SELECT last_value FROM building_id_seq");
		res.next();
		building_id = res.getInt(1);

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

	private void queryReport(HttpServletRequest request, HttpServletResponse response)
			throws JSONException, SQLException, IOException {

		System.out.println("Just testing add to db, worry about querying later.");

		// JSONArray list = new JSONArray();
		//
		// // request report
		// if (report_type == null || report_type.equalsIgnoreCase("request")) {
		// String sql = "select report.id, report_type, resource_type, " +
		// "disaster_type, first_name, last_name, time_stamp, ST_X(geom) as " +
		// "longitude, ST_Y(geom) as latitude, message from report, person, " +
		// "request_report where reportor_id = person.id and report.id = " +
		// "report_id";
		// queryReportHelper(sql,list,"request",disaster_type,resource_or_damage);
		// }
		//
		// // donation report
		// if (report_type == null || report_type.equalsIgnoreCase("donation")) {
		// String sql = "select report.id, report_type, resource_type, " +
		// "disaster_type, first_name, last_name, time_stamp, ST_X(geom) as " +
		// "longitude, ST_Y(geom) as latitude, message from report, person, " +
		// "donation_report where reportor_id = person.id and report.id = " +
		// "report_id";
		// queryReportHelper(sql,list,"donation",disaster_type,resource_or_damage);
		// }
		//
		// // damage report
		// if (report_type == null || report_type.equalsIgnoreCase("damage")) {
		// String sql = "select report.id, report_type, damage_type, " +
		// "disaster_type, first_name, last_name, time_stamp, ST_X(geom) as " +
		// "longitude, ST_Y(geom) as latitude, message from report, person, " +
		// "damage_report where reportor_id = person.id and report.id = " +
		// "report_id";
		// queryReportHelper(sql,list,"damage",disaster_type,resource_or_damage);
		// }
		//
		// response.getWriter().write(list.toString());
	}

	private void queryReportHelper(String sql, JSONArray list, String report_type, String disaster_type,
			String resource_or_damage) throws SQLException {
		System.out.println("Just testing add to db, worry about querying later.");

		// DBUtility dbutil = new DBUtility();
		// if (disaster_type != null) {
		// sql += " and disaster_type = '" + disaster_type + "'";
		// }
		// if (resource_or_damage != null) {
		// if (report_type.equalsIgnoreCase("damage")) {
		// sql += " and damage_type = '" + resource_or_damage + "'";
		// } else {
		// sql += " and resource_type = '" + resource_or_damage + "'";
		// }
		// }
		// ResultSet res = dbutil.queryDB(sql);
		// while (res.next()) {
		// // add to response
		// HashMap<String, String> m = new HashMap<String,String>();
		// m.put("report_id", res.getString("id"));
		// m.put("report_type", res.getString("report_type"));
		// if (report_type.equalsIgnoreCase("donation") ||
		// report_type.equalsIgnoreCase("request")) {
		// m.put("resource_type", res.getString("resource_type"));
		// }
		// else if (report_type.equalsIgnoreCase("damage")) {
		// m.put("damage_type", res.getString("damage_type"));
		// }
		// m.put("disaster", res.getString("disaster_type"));
		// m.put("first_name", res.getString("first_name"));
		// m.put("last_name", res.getString("last_name"));
		// m.put("time_stamp", res.getString("time_stamp"));
		// m.put("longitude", res.getString("longitude"));
		// m.put("latitude", res.getString("latitude"));
		// m.put("message", res.getString("message"));
		// list.put(m);
		// }
	}

	public void main() throws JSONException {
	}
}