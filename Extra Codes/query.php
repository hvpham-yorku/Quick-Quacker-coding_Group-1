<?php
$query= "SELECT * FROM table_name ";
mysqli_query($db, $query);

$result = mysqli_query($db,$query);
$row = mysqli_fetch_array($result);

while($row = mysqli_fetch_array($result)){
    echo "".$row["First Name"]."".$row["Last Name"]."".$row["Email"]."".$row["Username"].'br />';}
mysqli_close($db);
?>
