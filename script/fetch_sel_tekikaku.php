<?php

try {

	$raw = file_get_contents('php://input'); 									// POSTされた生のデータを受け取る
	$key = json_decode($raw); 													// json形式をphp変数に変換
	
	$jsonList = file_get_contents('../json/j_all_20240329.json');				// jsonファイルを読み込み
	$array = json_decode($jsonList,true);										// jsonファイルを連想配列で取得

	$targetIdx = array_search($key, array_column($array, 'registratedNumber'));	// postされた値と、registratedNumber列の値が一致する行のインデックスを取得する。

	$targetData = [];
	if ($targetIdx !== false) {
		$targetData = $array[$targetIdx];
	}
	$result = json_encode($targetData, JSON_UNESCAPED_UNICODE);

	header("Content-Type: application/json; charset=UTF-8");
	echo $result;

} catch (Exception $e){
	print "エラー:{$e->getMessage()}";
}
exit;
?>
