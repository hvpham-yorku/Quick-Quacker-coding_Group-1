<?php
session_start(); // Start the session to store user login state

error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "localhost";
$user = "root";
$pass = ""; 
$db = "quick_quacker";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$input = $_POST['username_email'];
$password = $_POST['password'];

// Find user by username or email using SELECT *
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
$stmt->bind_param("ss", $input, $input);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row['password'])) {
        // Set session variables
        $_SESSION['username'] = $row['username'];
        
        // Redirect to homepage
        header("Location: homepage.html");
        exit(); // Ensure script stops after redirect
    } else {
        header("Location: index.html?error=invalidpassword");
        exit();
    }
} else {
    header("Location: index.html?error=usernotfound");
    exit();
}

$conn->close();
?>