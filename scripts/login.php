<?php
	
    // Establish database connection
	$host = "172.127.98.121";
    $port = "22432";
	$username = "postgres";
	$password = "postgres";
	$dbname = "newapp";

	$conn = mysqli_connect($host, $port, $username, $password, $dbname);
	if (!$conn) {
		die("Connection failed: " . mysqli_connect_error());
	}

	// Get user inputs
	$email = $_POST["email"];
	$password = $_POST["password"];
	$user_type = $_POST["user_type"];

	// Check user type and retrieve user data from database
	if ($user_type == "client") {
		$sql = "SELECT * FROM clients WHERE email='$email' AND password='$password'";
		$result = mysqli_query($conn, $sql);
		if (mysqli_num_rows($result) > 0) {
			// Redirect to client landing page
			header("Location: client_v1.html");
			exit();
		}
	} else if ($user_type == "attorney") {
		$sql = "SELECT * FROM attorneys WHERE email='$email' AND password='$password'";
		$result = mysqli_query($conn, $sql);
		if (mysqli_num_rows($result) > 0) {
			// Redirect to attorney landing page
			header("Location: attorney_landing_page.html");
			exit();
		}
	}

	// Close database connection
	mysqli_close($conn);

	// Redirect back to login page if login failed
	header("Location: login.html");
	exit();
?>