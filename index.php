<?php
session_start();
if (isset($_SESSION['id'])) {//ログインしているとき
    // $username = $_SESSION['name'];
    // $msg = 'こんにちは' . htmlspecialchars($username, \ENT_QUOTES, 'UTF-8') . 'さん';
    // $link = '<a href="./signManager/signOut.php">ログアウト</a>';
    header('Location: http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['SCRIPT_NAME']).'/spaConfirm.php');
    exit();

} else {//ログインしていない時
    // $msg = 'ログインしていません';
    // $link = '<a href="./signManager/signInForm.php">ログイン</a>';
    header('Location: http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['SCRIPT_NAME']).'/signManager/signInForm.php');
    exit();
}
?>
<h1><?php echo $msg; ?></h1>
<?php echo $link; ?>
