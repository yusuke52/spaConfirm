<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="./styles/style.css" rel="stylesheet" />
    <title>SPA動作確認画面</title>
</head>
<body>

    <?php require_once "./signManager/checkSignIn.php" ?>

    <script type="module" src="./script/spaWebApi.js" defer></script>

    <?php 
    $title = 'WebAPI（https://jsonplaceholder.typicode.com/users/）からの値取得';
    include "./header.php" ;
    ?>

    <br>
    IDに1～10までの値を入力してください<br>
    ID:<input id="inputID" type="number"></input><br>
    <label id="result1"></label><br>
    <label id="result2"></label><br>
    <label id="result3"></label>

    <noscript>javascriptが利用できません。</noscript>
</body>
</html>