<?php

/**
 * サインアウト画面表示処理
 * @description サインアウト時に呼び出される画面。
 */

// logファイル読み込み
require_once '../log/log.php';

// LogWriteクラス
$logWrite = new LogWrite();

$logWrite->LogWriting('start:'.basename(__FILE__));             //ログ出力

session_start();

$name = isset($_SESSION['name']) ? $_SESSION['name'] : '';
$mail = isset($_SESSION['mail']) ? $_SESSION['mail'] : '';

$_SESSION = array();                                            //セッションの中身をすべて削除
session_destroy();                                              //セッションを破壊

$logWrite->LogWriting('サインアウトしました。'.sprintf('　名前:%s メールアドレス:%s',$name,$mail));     //ログ出力
$logWrite->LogWriting('end:'.basename(__FILE__));                                                    //ログ出力

?>

<p>サインアウトしました。</p>
<a href="./signInForm.php">サインイン画面へ</a>
