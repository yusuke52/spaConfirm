<?php
session_start();

if (isset($_SERVER['HTTPS']) AND $_SERVER['HTTPS'] == 'on') {
    $protocol = 'https://'; 
 }else{
    $protocol = 'http://'; 
 }

if (isset($_SESSION['id'])) {
    //ログインしている時、メニュー画面にリダイレクト
    header('Location: '.$protocol.$_SERVER['HTTP_HOST'].':'.$_SERVER['SERVER_PORT'].dirname($_SERVER['SCRIPT_NAME']).'/menu.php');
    exit();

} else {
    //ログインしていない時、サイン画面にリダイレクト
    header('Location: '.$protocol.$_SERVER['HTTP_HOST'].':'.$_SERVER['SERVER_PORT'].dirname($_SERVER['SCRIPT_NAME']).'/signManager/signInForm.php');
    exit();
}
?>
