package edu.sanborn.makehistoryservlet;

import java.io.IOException;
import org.json.JSONObject;
import org.json.JSONException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import org.json.JSONArray;
import edu.sanborn.makehistoryservlet.TalkToDB;

/**
 * Servlet implementation class HttpServlet
 */
@WebServlet("/SanbornServlet")
public class SanbornServlet extends javax.servlet.http.HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see javax.servlet.http.HttpServlet#javax.servlet.http.HttpServlet()
     */
    public SanbornServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse 
			response) throws ServletException, IOException {
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		
		String tab_id = request.getParameter("tab_id");
		
		// create a report
		if (tab_id.equals("0")) {
			System.out.println("A contribution is submitted!");
			try {
				createReport(request, response);
			} catch (SQLException e) {
				e.printStackTrace();
			}
		} 
		
		// query reports
		else if (tab_id.equals("1")) {
			try {
				queryReport(request, response);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	

	private void createReport(HttpServletRequest request, HttpServletResponse 
			response) throws SQLException, IOException {
		TalkToDB talktodb = new TalkToDB();		
		String sql;
		
	
		// 2. create historic building information submission
		String historicAddress = request.getParameter("historicAddress");
		String buildingCode = request.getParameter("buildingCode");
		String designation = request.getParameter("designation");
		String historicBlogs = request.getParameter("historicBlogs");
		String comments = request.getParameter("comments");
		if (historicAddress != null) {historicAddress = "'" + historicAddress + "'";}
		if (buildingCode != null) {buildingCode = "'" + buildingCode + "'";}
		if (designation != null) {designation = "'" + designation + "'";}
		if (historicBlogs != null) {historicBlogs = "'" + historicBlogs + "'";}
		if (comments != null) {comments = "'" + comments + "'";}
		
		sql = "insert into historicbuildings (hist_addr, build_code" +
				") values (" + historicAddress + "," + buildingCode + ')';
		talktodb.modifyDB(sql);
		
		System.out.println(sql);
		System.out.println("Success! Historic building information entered.");
		
//		// 3. create report
//		int report_id = 0;
//		String report_type = request.getParameter("report_type");
//		String disaster_type = request.getParameter("disaster_type");
//		String lon = request.getParameter("longitude");
//		String lat = request.getParameter("latitude");
//		String message = request.getParameter("message");
//		String add_msg = request.getParameter("additional_message");
//		if (report_type != null) {report_type = "'" + report_type + "'";}
//		if (disaster_type != null) {disaster_type = "'" + disaster_type + "'";}
//		if (message != null) {message = "'" + message + "'";}
//		if (add_msg != null) {add_msg = "'" + add_msg + "'";}
//		
//		sql = "insert into report (reportor_id, report_type, disaster_type, geom," +
//				" message) values (" + user_id + "," + report_type + "," + disaster_type
//				+ ", ST_GeomFromText('POINT(" + lon + " " + lat + ")', 4326)" + "," + 
//				message + ")";
//		dbutil.modifyDB(sql);
		
		
		// response that the report submission is successful
		JSONObject data = new JSONObject();
		try {
			data.put("status", "success");
		} catch (JSONException e) {
			e.printStackTrace();
		}	
		response.getWriter().write(data.toString());
		
	}

	private void queryReport(HttpServletRequest request, HttpServletResponse 
			response) throws JSONException, SQLException, IOException {

		System.out.println("Just testing add to db, worry about querying later.");
		
//		JSONArray list = new JSONArray();
		//		
//		// request report
//		if (report_type == null || report_type.equalsIgnoreCase("request")) {
//			String sql = "select report.id, report_type, resource_type, " +
//					"disaster_type, first_name, last_name, time_stamp, ST_X(geom) as " +
//					"longitude, ST_Y(geom) as latitude, message from report, person, " +
//					"request_report where reportor_id = person.id and report.id = " +
//					"report_id";
//			queryReportHelper(sql,list,"request",disaster_type,resource_or_damage);
//		}
//		
//		// donation report
//		if (report_type == null || report_type.equalsIgnoreCase("donation")) {
//			String sql = "select report.id, report_type, resource_type, " +
//					"disaster_type, first_name, last_name, time_stamp, ST_X(geom) as " +
//					"longitude, ST_Y(geom) as latitude, message from report, person, " +
//					"donation_report where reportor_id = person.id and report.id = " +
//					"report_id";
//			queryReportHelper(sql,list,"donation",disaster_type,resource_or_damage);
//		}		
//		
//		// damage report
//		if (report_type == null || report_type.equalsIgnoreCase("damage")) {
//			String sql = "select report.id, report_type, damage_type, " +
//					"disaster_type, first_name, last_name, time_stamp, ST_X(geom) as " +
//					"longitude, ST_Y(geom) as latitude, message from report, person, " +
//					"damage_report where reportor_id = person.id and report.id = " +
//					"report_id";
//			queryReportHelper(sql,list,"damage",disaster_type,resource_or_damage);
//		}
//		
//		response.getWriter().write(list.toString());
	}
	
//	private void queryReportHelper(String sql, JSONArray list, String report_type,
//			String disaster_type, String resource_or_damage) throws SQLException {
//		System.out.println("Just testing add to db, worry about querying later.");
		
//		DBUtility dbutil = new DBUtility();	
//		if (disaster_type != null) {
//			sql += " and disaster_type = '" + disaster_type + "'";
//		}
//		if (resource_or_damage != null) {
//			if (report_type.equalsIgnoreCase("damage")) {
//				sql += " and damage_type = '" + resource_or_damage + "'";
//			} else {
//				sql += " and resource_type = '" + resource_or_damage + "'";
//			}
//		}
//		ResultSet res = dbutil.queryDB(sql);
//		while (res.next()) {
//			// add to response
//			HashMap<String, String> m = new HashMap<String,String>();
//			m.put("report_id", res.getString("id"));
//			m.put("report_type", res.getString("report_type"));			
//			if (report_type.equalsIgnoreCase("donation") || 
//					report_type.equalsIgnoreCase("request")) {
//				m.put("resource_type", res.getString("resource_type"));
//			} 
//			else if (report_type.equalsIgnoreCase("damage")) {
//				m.put("damage_type", res.getString("damage_type"));
//			}
//			m.put("disaster", res.getString("disaster_type"));
//			m.put("first_name", res.getString("first_name"));
//			m.put("last_name", res.getString("last_name"));
//			m.put("time_stamp", res.getString("time_stamp"));
//			m.put("longitude", res.getString("longitude"));
//			m.put("latitude", res.getString("latitude"));
//			m.put("message", res.getString("message"));
//			list.put(m);
//		}

	
	public void main() throws JSONException {
	}
}