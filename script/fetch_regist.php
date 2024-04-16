<?php

$raw = file_get_contents('php://input'); 					// POSTされた生のデータを受け取る

//$dsn = 'mysql:dbname=testdb; host=127.0.0.1; charset=utf8';
$dsn = 'mysql:dbname=testdb; host=127.0.0.1; charset=utf8mb4';		//サロゲートペア対応
$usr = 'root';
$passwd = '';

try {
	$db = new PDO($dsn, $usr, $passwd);

	$db->beginTransaction();

	//呼び出し元から登録IDの取得
	$registID = json_decode($raw,true)[1]['registID'];

	if ($registID == ''){
		//新規登録時（登録ID新規採番）
		$stt = $db->prepare('select max(registID) as lastRegistID from t_location');
		$stt->execute();
		$row = $stt->fetch(PDO::FETCH_ASSOC);
		$registID = $row['lastRegistID'] + 1;
	} else {
		//更新登録時（前回データの削除）
		$stt = $db->prepare('delete from  t_location where registID = :registID');
		$stt->bindValue(':registID', $registID);
		$stt->execute();
	}

	$values = '';		//Values句のプレースホルダ全文格納用
	$arr = [];			//プレースホルダと、呼び出し元から取得した登録値の紐づけ用

	//Values句のプレースホルダ作成及び、プレースホルダと登録値の関連付け
	foreach(json_decode($raw) as $obj) {
		$values .= $values!=='' ? ',' : '';
		$rowNo = $obj->rowNo;
		$values .= sprintf("(:registID%s,:rowNo%s,:prefecture%s,:city%s,:tekikakuNo%s,:tekikakuName%s)", $rowNo, $rowNo, $rowNo, $rowNo, $rowNo, $rowNo);
		$arr['registID'.$rowNo] = $registID;
		$arr['rowNo'.$rowNo] = $obj->rowNo;
		$arr['prefecture'.$rowNo] = $obj->prefecture;
		$arr['city'.$rowNo] = $obj->city;
		$arr['tekikakuNo'.$rowNo] = $obj->tekikakuNo;
		$arr['tekikakuName'.$rowNo] = $obj->tekikakuName;
	}

	$stt = $db->prepare('insert into t_location (registID,rowNo,prefecture,city,tekikakuNo,tekikakuName) values '.$values);

	//プレースホルダへ登録値のバインド
	foreach($arr as $key => $value) $stt->bindValue(':'.$key, $value);

	$stt->execute();

	$db->commit();

	$return = array('registID'=> $registID);  //登録したデータの登録ID

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
