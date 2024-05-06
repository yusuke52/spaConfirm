<?php

/**
 * t_spa_confirmテーブルからのデータ取得処理
 * @description postされた登録IDに該当するレコードをt_spa_confirmテーブルから取得し、\
 * JSON文字列形式で標準出力する。
 */

/* t_spa_confirmテーブルのCreateTable文
 CREATE TABLE `t_spa_confirm` (
 	`id` int(11) NOT NULL AUTO_INCREMENT,
 	`registID` int(5) NOT NULL,
 	`rowNo` int(3) NOT NULL,
 	`prefecture` varchar(255) DEFAULT NULL,
 	`city` varchar(255) DEFAULT NULL,
 	`tekikakuNo` char(14) DEFAULT NULL,
 	`tekikakuName` varchar(600) DEFAULT NULL,
 	PRIMARY KEY (`id`)
 	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
*/

// configファイル読み込み
require_once '../config/config.php';

// logファイル読み込み
require_once '../log/log.php';

// LogWriteクラス
$logWrite = new LogWrite();
$logWrite->LogWriting('start:'.basename(__FILE__));     //ログ出力

$raw = file_get_contents('php://input'); 	// POSTされた生のデータを受け取る
$key = json_decode($raw); 					// json形式をphp変数に変換

$logWrite->LogWriting('POSTされた値=登録ID:'.$key);     //ログ出力

try {
//①DB接続ありパターン start
	$db = new PDO(Config::get('dsn'), Config::get('usr'), Config::get('passwd'));
	
	$stt = $db->prepare('select * from t_spa_confirm where registID = :registID order by rowNo');
	$stt->bindValue(':registID', $key);
	$stt->execute();

	$result = $stt->fetchAll();

	$json_array = json_encode($result, JSON_UNESCAPED_UNICODE);

	header("Content-Type: application/json; charset=UTF-8");
	echo $json_array;
//①DB接続ありパターン end

//②DB接続なしパターン（DB接続環境がない場合、①DB接続ありパターンをコメントアウトし、②DB接続なしパターンをコメント解除してください。） start
	// $result = array(array('id'=>1,'registID'=>1,'rowNo'=>1,'prefecture'=>'tokyo','city'=>'1','tekikakuNo'=>'T1030005007532','tekikakuName'=>'𠀋宮代町商工会'),
	// 				array('id'=>2,'registID'=>1,'rowNo'=>2,'prefecture'=>'osaka','city'=>'2','tekikakuNo'=>'T1700150000224','tekikakuName'=>'𠀋Ａｉｒ　Ｎｉｕｇｉｎｉ　Ｌｉｍｉｔｅｄ'),
	// 				array('id'=>3,'registID'=>1,'rowNo'=>3,'prefecture'=>'aichi','city'=>'1','tekikakuNo'=>'T1700150000232','tekikakuName'=>'ＡＢＡＣ日本支援協議会'),
	// 				array('id'=>4,'registID'=>1,'rowNo'=>4,'prefecture'=>'tokyo','city'=>'3','tekikakuNo'=>'T1700150000629','tekikakuName'=>'謙慎書道会'));

	// $json_array = json_encode($result, JSON_UNESCAPED_UNICODE);

	// header("Content-Type: application/json; charset=UTF-8");
	// echo $json_array;
//②DB接続なしパターン end

	$logWrite->LogWriting(sprintf('登録ID:%s t_spa_confirmテーブル抽出結果:%s',$key,$json_array));     //ログ出力

} catch (PDOException $e){
	$msg = $e->getMessage();
	print "接続エラー:{$msg}";
    $logWrite->LogWriting('登録ID:'.$key.' エラー内容:'.$msg,true);   //ログ出力
} catch (Exception $e){
	$msg = $e->getMessage();
	print "エラー:{$msg}";
    $logWrite->LogWriting('登録ID:'.$key.' エラー内容:'.$msg,true);   //ログ出力
} finally {
	$db = null;
}

$logWrite->LogWriting('end:'.basename(__FILE__));     //ログ出力
exit;

?>
