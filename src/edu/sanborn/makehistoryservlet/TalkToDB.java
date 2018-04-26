package edu.sanborn.makehistoryservlet;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class TalkToDB {

	// Set PostgreSQL database connection parameters
	private static final String Driver = "org.postgresql.Driver";
	private static final String ConnUrl = "jdbc:postgresql://localhost:5432/sanborn";
	private static final String Username = "postgres";
	private static final String Password = "admin";

	// This is a constructor
	public TalkToDB() {
	}

	/*
	 * Create a Connection to the database using the driver, URL, username, and
	 * password specified above in the private fields.
	 * 
	 * The method returns a Connection object, which can be used to create SQL
	 * statements to query and modify the database. If the connection fails, it
	 * returns null.
	 */
	private Connection connectDB() {
		Connection conn = null;
		try {
			Class.forName(Driver);
			conn = DriverManager.getConnection(ConnUrl, Username, Password);
			return conn;
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		return conn;
	}

	/*
	 * Execute a SQL query (e.g. SELECT) and return a ResultSet object
	 * 
	 * The method takes a SQL query as a String and returns a ResultSet object for
	 * the query result. It uses connectDB() to connect to the database. If the
	 * connection fails, it returns null.
	 */
	public ResultSet queryDB(String sql) {
		Connection conn = connectDB();
		ResultSet res = null;
		try {
			if (conn != null) {
				Statement stmt = conn.createStatement();
				res = stmt.executeQuery(sql);
				conn.close();
			}
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		return res;
	}

	/*
	 * Execute a SQL query (e.g. INSERT, UPDATE) to modify the database. No return
	 * value is needed.
	 * 
	 * The method takes a SQL query as a string and returns nothing. It also uses
	 * connectDB() to connect to the database. If the connection fails, the database
	 * is not modified.
	 */
	public void modifyDB(String sql) {
		Connection conn = connectDB();
		try {
			if (conn != null) {
				Statement stmt = conn.createStatement();
				stmt.execute(sql);
				stmt.close();
				conn.close();
			}
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}

	// Main method, used to test the queryDB() and modifyDB() methods
	public static void main(String[] args) throws SQLException {

		// Initialize the database utility
		TalkToDB historicbuildingtest = new TalkToDB();

		// Test querying the database
		ResultSet res = historicbuildingtest.queryDB("SELECT * from historicbuildings");
		while (res.next()) {
			System.out.println(res.getString("designation"));
		}

	}

}