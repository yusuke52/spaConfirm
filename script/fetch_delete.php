<?php

/**
 * t_spa_confirmテーブルからのデータ削除処理
 * @description postされた登録IDに該当するレコードをt_spa_confirmテーブルから削除する。\
 * t_spa_confirmテーブルから削除したデータのregistIDを標準出力する。
 */

 // configファイル読み込み
require_once '../config/config.php';

$raw = file_get_contents('php://input'); 							// POSTされた生のデータを受け取る
$key = json_decode($raw); 											// json形式をphp変数に変換

try {

	$db = new PDO(Config::get('dsn'), Config::get('usr'), Config::get('passwd'));

	$db->beginTransaction();

	//更新登録時（前回データの削除）
	$stt = $db->prepare('delete from  t_spa_confirm where registID = :registID');
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
