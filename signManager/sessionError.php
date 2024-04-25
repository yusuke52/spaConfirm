<?php
session_start();
$_SESSION = array();//セッションの中身をすべて削除
session_destroy();//セッションを破壊
?>

<p>ログイン情報がセッションに存在しません。再ログインしてください。（長時間画面を放置した場合、セッションタイムアウトによりログイン情報が無効になります。）</p>
<a href="./signInForm.php">ログインへ</a>
