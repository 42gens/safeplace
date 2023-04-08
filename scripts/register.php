<?php

// Connect to the remote PostgreSQL database
$db = new PDO("pgsql:host=172.127.98.121;port=22432;dbname=newapp;user=postgres;password=postgres");

// Get the user type, email, password, city, and state from the registration form
$user_type = $_POST['user_type'];
$email = $_POST['email'];
$password = $_POST['password'];
//$city = $_POST['city'];
$state = $_POST['state'];

// Prepare the SQL statement based on the user type
if ($user_type == 'client') {
    #$sql = "INSERT INTO clients (email, password, city, state) VALUES (:email, :password, :city, :state)";
    $sql = "INSERT INTO clients (email, password, city, state) VALUES (:email, :password, :city, :state)";
} else {
    #$sql = "INSERT INTO attorneys (email, password, city, state) VALUES (:email, :password, :city, :state)";
    $sql = "INSERT INTO attorneys (email, password, city, state) VALUES (:email, :password, :city, :state)";
}

//