<?php
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

$username = $_POST['username'];
$email = $_POST['email'];
$password = $_POST['password'];

// Password validation
$uppercase = preg_match('/[A-Z]/', $password);
$lowercase = preg_match('/[a-z]/', $password);
$number = preg_match('/[0-9]/', $password);
$symbol = preg_match('/[^A-Za-z0-9]/', $password);
$minLength = strlen($password) >= 8;

// Check if password meets requirements
if (!$uppercase || !$lowercase || !$number || !$symbol || !$minLength) {
    $error = "password_requirements";
    header("Location: index.html?error=$error");
    exit();
}

// Hash password only after validation
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Check if email exists
$check_email = $conn->prepare("SELECT * FROM users WHERE email = ?");
$check_email->bind_param("s", $email);
$check_email->execute();
$check_email->store_result();

// Check if username exists
$check_username = $conn->prepare("SELECT * FROM users WHERE username = ?");
$check_username->bind_param("s", $username);
$check_username->execute();
$check_username->store_result();

if ($check_email->num_rows > 0) {
    // Email already exists
    header("Location: index.html?error=emailtaken");
    exit();
} else if ($check_username->num_rows > 0) {
    // Username already exists
    header("Location: index.html?error=usernametaken");
    exit();
} else {
    $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $hashedPassword);
    if ($stmt->execute()) {
        // Redirect to login page after successful registration
        header("Location: index.html?registration=success");
        exit(); // Ensure script stops after redirect
    } else {
        header("Location: index.html?error=dberror");
        exit();
    }
}
$conn->close();
?>