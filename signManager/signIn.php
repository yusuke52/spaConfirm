<?php

/**
 * サインイン処理
 * @description POSTされたメールアドレス(ログインID)とパスワードの組み合わせが、\
 * m_usersテーブルに登録されている値と一致する場合、POSTされた情報をセッションに登録後、メニュー画面にリダイレクトする。\
 * m_usersテーブルに登録されている値と一致しない場合、エラーメッセージの表示及び、サインイン画面へのリンクを表示する。
 */

/* m_usersテーブルのCreateTable文
 CREATE TABLE `m_users` (
     `id` int(11) NOT NULL AUTO_INCREMENT,
     `name` varchar(50) NOT NULL,
     `mail` varchar(100) NOT NULL,
     `pass` varchar(100) NOT NULL,            #PHPでpassword_hashによりハッシュ値に変換時、60文字以上に暗号化されるため、カラム長60文字以上（上限不明）の設定が必要。
     PRIMARY KEY (`id`)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci
*/

// configファイル読み込み
require_once '../config/config.php';

session_start();
$mail = $_POST['mail'];

try {
    $dbh = new PDO(Config::get('dsn'), Config::get('usr'), Config::get('passwd'));

    $sql = "SELECT * FROM m_users WHERE mail = :mail";
    $stmt = $dbh->prepare($sql);
    $stmt->bindValue(':mail', $mail);
    $stmt->execute();
    $member = $stmt->fetch();
    
} catch (PDOException $e) {
    $msg = $e->getMessage();
} finally {
	$dbh = null;
}

//指定したハッシュがパスワードにマッチしているかチェック
if ($member != false && password_verify($_POST['pass'], $member['pass'])) {
    //DBのユーザー情報をセッションに保存
    $_SESSION['id'] = $member['id'];
    $_SESSION['name'] = $member['name'];
    $_SESSION['mail'] = $member['mail'];
    $_SESSION['pass'] = $member['pass'];

//    $msg = 'サインインしました。';
//    $link = '<a href="../menu.php">メニュー画面</a>';

    //メニュー画面へリダイレクト
    header('Location: http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['SCRIPT_NAME'], 2).'/menu.php');
    exit();

} else {
    $msg = 'メールアドレスもしくはパスワードが間違っています。';
    $link = '<a href="./signInForm.php">戻る</a>';
}
    
?>

<h1><?php echo $msg; ?></h1>
<?php echo $link; ?>
