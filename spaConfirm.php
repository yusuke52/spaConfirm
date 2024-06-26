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

    <script type="module" src="./script/spaConfirm.js" defer></script>

    <?php 
    $title = '連動リスト及び非同期通信でのDB更新処理';
    include "./header.php" ;
    ?>

    <br>
    <table>
        <tr>
            <td style="width:436px">
                <form id="registMode">
                    <fieldset style="width:400px">
                    <legend>登録モード</legend>
                        <input type="radio" id="insMode" name="dbRegistMode" value="insert" />
                        <label for="insMode">新規</label>
                        &nbsp;
                        <input type="radio" id="updMode" name="dbRegistMode" value="update" checked />
                        <label for="updMode">更新</label>
                        &nbsp;
                        <input type="radio" id="delMode" name="dbRegistMode" value="delete" />
                        <label for="delMode">削除</label>
                    </fieldset>
                </form>
            </td>
            <td style="vertical-align:bottom">
                <button id="resetButton">リセット</button>
            </td>
        </tr>
    </table>
    <br>
    <table>
        <tr>
            <td class="headerTitle">登録ＩＤ</td>
            <td style="width:77px;"><input id="registID" type="number" style="width:70px; height:29px;"></input></td>
            <td style="width:122px;"><button id="searchButton">参照</button></td>
            <td></td>
            <td style="width:122px;"><button id="addRowButton">行追加</button></td>
            <td style="width:122px;"><button id="delRowButton">選択行削除</button></td>
        </tr>
    </table>

    <div class="tableBox">
    <table id="detailTable">
        <th class="sticky" style="width: 180px;">都道府県</th>
        <th class="sticky" style="width: 180px;">市区町村</th>
        <th class="sticky" style="width: 200px;">適格請求発行事業No.</th>
        <th class="sticky" style="width: 830px;">適格請求書発行事業者名（「人格のない社団等」のみ対応）</th>
        <th class="sticky" style="width: 40px;">選択</th>
    </table>
    </div>
    <br>
    <table>
        <tr>
            <td align="right"><button id="reflectDBButton">DB反映</button></td>
        </tr>
    </table>

    <!-- 連動リスト原本（行追加時、リスト項目は以下の要素をコピーしたものを使用） -->
    <div hidden>
        <select id="prefectureMaster">
            <option value="">選択してください</option>
        </select>
        <select id="cityMaster">
            <option value="">選択してください</option>
        </select>
    </div>

    <noscript>javascriptが利用できません。</noscript>
</body>
</html>