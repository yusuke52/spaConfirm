<?php

$raw = file_get_contents('php://input'); 							// POSTされた生のデータを受け取る
$key = json_decode($raw); 											// json形式をphp変数に変換

$dsn = 'mysql:dbname=testdb; host=127.0.0.1; charset=utf8mb4';		//サロゲートペア対応
$usr = 'root';
$passwd = '';

try {
	$db = new PDO($dsn, $usr, $passwd);

	$db->beginTransaction();

	//更新登録時（前回データの削除）
	$stt = $db->prepare('delete from  t_location where registID = :registID');
	$stt->bindValue(':registID', $key);
	$stt->execute();

	$db->commit();

	$return = array('registID'=> $key);  //削除したデータの登録ID

	header("Content-Type: application/json; charset=UTF-8");
	echo json_encode($return, JSON_UNESCAPED_UNICODE);

} catch (PDOException $e){
	$db->rollback();
	print "接続エラー:{$e->getMessage()}";
} catch (Exception $e){
	$db->rollback();
	print "エラー:{$e->getMessage()}";
} finally {
	$db = null;
}
exit;
?>
