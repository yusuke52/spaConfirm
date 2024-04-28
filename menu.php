<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="./styles/style.css" rel="stylesheet" />
    <title>メニュー画面</title>
</head>
<body>

    <?php require_once "./signManager/checkSignIn.php" ?>

    <style type="text/css">

        /* コンテナ */
        #container {
            margin-left:5px;
            display: grid;
            grid-template-rows: 150px 100px;
            /* grid-template-columns: 150px 1fr; */
            grid-template-columns: 830px 706px;
            grid-template-areas:
                "areaA areaB"
                "areaA areaC";
            column-gap: 5px;
            row-gap: 0.5em;
        }

        /* アイテム */
        #itemA {
            grid-area: areaA;
            /* background: #f88; */
            background:radial-gradient(#00FFCC, #00FF66); 
            border: 2px solid #00CC00;
            border-radius: 5px;

        }
        #itemB {
            grid-area: areaB;
            /* background: #8f8; */
            background:radial-gradient(#00CCFF, #0099FF); 
            border: 2px solid #0066FF;
            border-radius: 5px;
        }
        #itemC {
            grid-area: areaC;
            /* background: #88f; */
            background:radial-gradient(#CCCC66, #CC9900); 
            place-content: center;
            border: 2px solid #CC6600;
            border-radius: 5px;
        }
    </style>

    <?php 
        $title = 'メニュー';
        include "./header.php" ;
    ?>
    <br>
    <div id="container">
        <div id="itemA">分類１
            <ul>
                <li><a href="./spaConfirm.php">連動リスト及び非同期通信でのDB更新処理</a></li>
                <li><a href="./spaWebApi.php">WebAPI（https://jsonplaceholder.typicode.com/users/）からの値取得</a></li>
            </ul>
        </div>
        <div id="itemB">分類２</div>
        <div id="itemC">分類３</div>
    </div>

    <noscript>javascriptが利用できません。</noscript>
</body>
</html>