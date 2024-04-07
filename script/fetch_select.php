<?php

/*
CREATE TABLE `t_location` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`registID` int(5) NOT NULL,
	`rowNo` int(3) NOT NULL,
	`prefecture` varchar(255) DEFAULT NULL,
	`city` varchar(255) DEFAULT NULL,
	PRIMARY KEY (`id`)
  ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci
*/

$raw = file_get_contents('php://input'); 	// POSTされた生のデータを受け取る
$key = json_decode($raw); 					// json形式をphp変数に変換

$dsn = 'mysql:dbname=testdb; host=127.0.0.1; charset=utf8';
$usr = 'root';
$passwd = '';

try {
//①DB接続ありパターン start
	$db = new PDO($dsn, $usr, $passwd);
	
	$stt = $db->prepare('select * from t_location where registID = :registID order by rowNo');
	$stt->bindValue(':registID', $key);
	$stt->execute();

	$result = $stt->fetchAll();

	$json_array = json_encode($result, JSON_UNESCAPED_UNICODE);

	header("Content-Type: application/json; charset=UTF-8");
	echo $json_array;
//①DB接続ありパターン end

//②DB接続なしパターン（DB接続環境がない場合、①DB接続ありパターンをコメントアウトし、②DB接続なしパターンをコメント解除してください。） start
	// $result = array(array('id'=>12,'registID'=>1,'rowNo'=>1,'prefecture'=>'tokyo','city'=>'1'),
	// 				array('id'=>13,'registID'=>1,'rowNo'=>2,'prefecture'=>'osaka','city'=>'2'),
	// 				array('id'=>14,'registID'=>1,'rowNo'=>3,'prefecture'=>'aichi','city'=>'1'),
	// 				array('id'=>15,'registID'=>1,'rowNo'=>4,'prefecture'=>'tokyo','city'=>'3'));

	// $json_array = json_encode($result, JSON_UNESCAPED_UNICODE);

	// header("Content-Type: application/json; charset=UTF-8");
	// echo $json_array;
//②DB接続なしパターン end

} catch (PDOException $e){
	print "接続エラー:{$e->getMessage()}";
} catch (Exception $e){
	print "エラー:{$e->getMessage()}";
} finally {
	$db = null;
}
exit;
?>
