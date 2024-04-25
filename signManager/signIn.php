<?php

// CREATE TABLE `m_users` (
//     `id` int(11) NOT NULL AUTO_INCREMENT,
//     `name` varchar(50) NOT NULL,
//     `mail` varchar(100) NOT NULL,
//     `pass` varchar(100) NOT NULL,            #PHPでpassword_hashによりハッシュ値に変換時、60文字以上に暗号化されるため、カラム長60文字以上（上限不明）の設定が必要。
//     PRIMARY KEY (`id`)
//   ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci

session_start();
$mail = $_POST['mail'];
$dsn = "mysql:host=localhost; dbname=testdb; charset=utf8";
$username = "root";
$password = "";
try {
    $dbh = new PDO($dsn, $username, $password);
} catch (PDOException $e) {
    $msg = $e->getMessage();
}

$sql = "SELECT * FROM m_users WHERE mail = :mail";
$stmt = $dbh->prepare($sql);
$stmt->bindValue(':mail', $mail);
$stmt->execute();
$member = $stmt->fetch();
//指定したハッシュがパスワードにマッチしているかチェック
if ($member != false && password_verify($_POST['pass'], $member['pass'])) {
    //DBのユーザー情報をセッションに保存
    $_SESSION['id'] = $member['id'];
    $_SESSION['name'] = $member['name'];
    $_SESSION['mail'] = $member['mail'];
    $_SESSION['pass'] = $member['pass'];
    $msg = 'ログインしました。';
//    $link = '<a href="../index.php">ホーム</a>';
//    $link = '<a href="../spaConfirm.php">SPA確認</a>';
    header('Location: http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['SCRIPT_NAME'], 2).'/spaConfirm.php');
    exit();
} else {
    $msg = 'メールアドレスもしくはパスワードが間違っています。';
    $link = '<a href="./signInForm.php">戻る</a>';
}
?>

<h1><?php echo $msg; ?></h1>
<?php echo $link; ?>
