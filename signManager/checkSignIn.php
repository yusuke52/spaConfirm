<?php

    session_start();

    if( isset($_SESSION['mail']) && isset($_SESSION['pass']) ){
        $dsn = "mysql:host=localhost; dbname=testdb; charset=utf8";
        $username = "root";
        $password = "";
        try {
            $dbh = new PDO($dsn, $username, $password);
        } catch (PDOException $e) {
            $msg = $e->getMessage();
        }
        
        $sql = "SELECT * FROM m_users WHERE mail = :mail and pass = :pass";
        $stmt = $dbh->prepare($sql);
        $stmt->bindValue(':mail', $_SESSION['mail']);
        $stmt->bindValue(':pass', $_SESSION['pass']);
        $stmt->execute();
        $member = $stmt->fetch();

        //セッションに設定されているmailとpassの組み合わせがDBに存在するかのチェック
        if ($member == false) {
            header('Location: http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['SCRIPT_NAME']).'/sessionError.php');
            exit();
        }
    } else {
        header('Location: http://'.$_SERVER['HTTP_HOST'].':'.$_SERVER['SERVER_PORT'].dirname($_SERVER['SCRIPT_NAME']).'/sessionError.php');
        exit();
    }
?>
