<?php

/**
 * サインアウト画面表示処理
 * @description サインアウト時に呼び出される画面。
 */

session_start();
$_SESSION = array();    //セッションの中身をすべて削除
session_destroy();      //セッションを破壊
?>

<p>サインアウトしました。</p>
<a href="./signInForm.php">サインイン画面へ</a>
