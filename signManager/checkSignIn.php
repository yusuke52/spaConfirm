<?php

/**
 * サインイン状態であるかをチェックする処理
 * @description セッションに登録されているメールアドレス(ログインID)とパスワードの組み合わせが、\
 * DBに登録されている値と一致するかを確認することで、サインイン状態であるかをチェックする。
 * サインイン状態でないとき、sessionError.phpにリダイレクトする。
 */

    // configファイル読み込み
    //(当ファイル(checkSignIn.php)は他ファイルからのrequireにより実行される。このため、相対パスをそのまま記述すると、
    // 呼び出し元ファイルからの相対パスを参照しに行くことになり、エラーが発生する。
    // 上記エラーを回避するため、__DIR__で当ファイルの絶対パスを取得し、そこからの相対パスを参照するようにする事。)
    require_once __DIR__.'/../config/config.php';

    session_start();

    if (isset($_SERVER['HTTPS']) AND $_SERVER['HTTPS'] == 'on') {
        $protocol = 'https://'; 
     }else{
        $protocol = 'http://'; 
     }
    
    if( isset($_SESSION['mail']) && isset($_SESSION['pass']) ){
        try {
            $dbh = new PDO(Config::get('dsn'), Config::get('usr'), Config::get('passwd'));

            $sql = "SELECT * FROM m_users WHERE mail = :mail and pass = :pass";
            $stmt = $dbh->prepare($sql);
            $stmt->bindValue(':mail', $_SESSION['mail']);
            $stmt->bindValue(':pass', $_SESSION['pass']);
            $stmt->execute();
            $member = $stmt->fetch();
    
        } catch (PDOException $e) {
            $msg = $e->getMessage();
        } finally {
            $dbh = null;
        }

        //セッションに設定されているmailとpassの組み合わせがDBに存在するかのチェック
        if ($member == false) {
            //当該ファイルのドキュメントルート以降のフォルダ構成を取得する。
            $path = str_replace(dirname(__DIR__,2), '', __DIR__);
            $path = preg_replace('/\\\/u', '/', $path);

            header('Location: '.$protocol.$_SERVER['HTTP_HOST'].':'.$_SERVER['SERVER_PORT'].$path.'/sessionError.php');
            exit();
        }
    } else {
        //当該ファイルのドキュメントルート以降のフォルダ構成を取得する。
        $path = str_replace(dirname(__DIR__,2), '', __DIR__);
        $path = preg_replace('/\\\/u', '/', $path);

        header('Location: '.$protocol.$_SERVER['HTTP_HOST'].':'.$_SERVER['SERVER_PORT'].$path.'/sessionError.php');
        exit();
    }
?>
