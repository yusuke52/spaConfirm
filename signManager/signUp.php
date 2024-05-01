<?php

/**
 * サインアップ処理
 * @description POSTされたデータをm_usersテーブルに登録する。\
 * POSTされたメールアドレス(サインインID)とパスワードの組み合わせが、m_usersテーブルに既に登録されている場合、\
 * エラーメッセージの表示及び、サインアップ画面へのリンクを表示する。\
 * POSTされたメールアドレス(サインインID)とパスワードの組み合わせが、m_usersテーブルに未登録の場合、\
 * POSTされたデータをm_usesテーブルへ新規登録し、サインイン画面へのリンクを表示する。
 */

//POSTされた値を変数に代入
$name = $_POST['name'];
$mail = $_POST['mail'];
$pass = password_hash($_POST['pass'], PASSWORD_DEFAULT);

$dsn = "mysql:host=localhost; dbname=testdb; charset=utf8";
$username = "root";
$password = "";
try {
    $dbh = new PDO($dsn, $username, $password);
} catch (PDOException $e) {
    $msg = $e->getMessage();
}

//POSTされたmail（サインインID）をキーに、m_usersテーブルにデータが存在するかを検索する。
$sql = "SELECT * FROM m_users WHERE mail = :mail";
$stmt = $dbh->prepare($sql);
$stmt->bindValue(':mail', $mail);
$stmt->execute();

$member = $stmt->fetch();

if ($member != false && $member['mail'] === $mail) {
    //既にデータが存在する場合（登録済みエラー）
    $msg = '同じメールアドレスが存在します。';
    $link = '<a href="./signUpForm.php">戻る</a>';
} else {
    //データが存在しない場合（未登録の場合）、POSTされたデータをm_usersテーブルに新規登録する。
    $sql = "INSERT INTO m_users(name, mail, pass) VALUES (:name, :mail, :pass)";
    $stmt = $dbh->prepare($sql);
    $stmt->bindValue(':name', $name);
    $stmt->bindValue(':mail', $mail);
    $stmt->bindValue(':pass', $pass);
    $stmt->execute();
    $msg = '会員登録が完了しました';
    $link = '<a href="./signInForm.php">サインインページ</a>';
}

?>

<h1><?php echo $msg; ?></h1>    <!--メッセージの出力-->
<?php echo $link; ?>
