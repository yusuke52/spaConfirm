<?php
session_start();
if (isset($_SESSION['id'])) {
    //ログインしている時、メニュー画面にリダイレクト
    header('Location: http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['SCRIPT_NAME']).'/menu.php');
    exit();

} else {
    //ログインしていない時、サイン画面にリダイレクト
    header('Location: http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['SCRIPT_NAME']).'/signManager/signInForm.php');
    exit();
}
?>
