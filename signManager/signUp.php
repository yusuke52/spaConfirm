<?php

/**
 * サインアップ処理
 * @description POSTされたデータをm_usersテーブルに登録する。\
 * POSTされたメールアドレス(サインインID)とパスワードの組み合わせが、m_usersテーブルに既に登録されている場合、\
 * エラーメッセージの表示及び、サインアップ画面へのリンクを表示する。\
 * POSTされたメールアドレス(サインインID)とパスワードの組み合わせが、m_usersテーブルに未登録の場合、\
 * POSTされたデータをm_usesテーブルへ新規登録し、サインイン画面へのリンクを表示する。
 */

// configファイル読み込み
require_once '../config/config.php';

// logファイル読み込み
require_once '../log/log.php';

// LogWriteクラス
$logWrite = new LogWrite();

$logWrite->LogWriting('start:'.basename(__FILE__));     //ログ出力

//POSTされた値を変数に代入
$name = $_POST['name'];
$mail = $_POST['mail'];
$pass = password_hash($_POST['pass'], PASSWORD_DEFAULT);

$logWrite->LogWriting('POSTされた値='.sprintf('　名前:%s メールアドレス:%s',$name,$mail));     //ログ出力

try {

    $dbh = new PDO(Config::get('dsn'), Config::get('usr'), Config::get('passwd'));

    //POSTされたmail（サインインID）をキーに、m_usersテーブルにデータが存在するかを検索する。
    $sql = "SELECT * FROM m_users WHERE mail = :mail";
    $stmt = $dbh->prepare($sql);
    $stmt->bindValue(':mail', $mail);
    $stmt->execute();

    $member = $stmt->fetch();

    if ($member != false && $member['mail'] === $mail) {
        //既にデータが存在する場合（登録済みエラー）
        $msg = '同じメールアドレスが既に存在します。';
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

    $logWrite->LogWriting($msg.sprintf('　名前:%s メールアドレス:%s',$name,$mail));     //ログ出力

} catch (PDOException $e) {
    $msg = $e->getMessage();
    $logWrite->LogWriting($msg,true);   //ログ出力
} catch (Exception $e){
    $msg = $e->getMessage();
    $logWrite->LogWriting($msg,true);   //ログ出力
} finally {
	$dbh = null;
}

$logWrite->LogWriting('end:'.basename(__FILE__));     //ログ出力

?>

<h1><?php echo $msg; ?></h1>    <!--メッセージの出力-->
<?php echo $link; ?>
