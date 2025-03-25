<!DOCTYPE html>
<?php
echo include 'connect.php'
?>
<html>
    <head>
        <meta name = "viewport" content="width=device-width, inital-scale=1" >
        <link rel="login-screen" href="loginscreen.css">
    </head>
    
    <!--Button to open Login-->
    <button onclick="document.getElementById('01').style.display='block'">
        Login
    </button>
    <!--Login page-->
    <div id ="01" class="modal">
        <span onclick="document.getElementById('01').style.display='none'" class="close" title="Close Login">&times;</span>
        <form class="login-form">
            <div class="imgcontainer">
                <img src="https://media.discordapp.net/attachments/1346210106982928422/1349791970423214132/image.png?ex=67d7063b&is=67d5b4bb&hm=f2f3bd9e42e94be24956fdb32dd45995871b8860c7c37363ad69485ff4f4d19b&=&format=webp&quality=lossless&width=930&height=930" alt="Logo" class="Duck" >
            </div>
            <div class="container">
                <label for="Username"><b>Username</b></label>
                <input type="text" placeholder="Enter Username" name="Username" required>
    
                <label for="password"><b>Password</b></label>
                <input type="text" placeholder="Enter Password" name="password" required>
    
                <button type="submit">Login</button>
                <label >
                    <input type="checkbox" checked="checked" name="remember"> Remember Me
                </label>
            </div>
    
            <div class="container">
                <button type="button" onclick="" class="cancel">Cancel</button>
                <span class="password">Forgot <a href="#">password?</a></span>
            </div>

            <?php
            echo include 'query.php'
            ?>
        </form>
    </div>
</html>


