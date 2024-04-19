'use strict';

import * as common from './common.js';

/**
 * 都道府県リスト設定メソッド
 * @method
 * @description prefecture.jsonに設定されている都道府県リストを、prefectureMasterリストに設定する。
 * @author Y.Y
 * @version 1.0.0
 */
const setPrefectureList = async () => {
    try {

        // 都道府県JSONリストの取得
        // let prefectureJson = new common.JsonList("./json/prefecture.json", "都道府県");
        let prefectureJson = common.JsonListFactory.of("./json/prefecture.json", "都道府県");
        const data = await prefectureJson.get();

        const prefectureElem = document.getElementById("prefectureMaster");
        for (let i in data){
            let optionElem = document.createElement("option");
            let value = data[i];
            optionElem.value = value.prefectureCd;
            optionElem.text = value.name;
            prefectureElem.appendChild(optionElem);
        };

    }catch (err) {
        window.alert(err);
        console.log(err,"error");
    }
}

/**
 * 市区町村リスト設定メソッド
 * @method
 * @param {string} prefectureid 都道府県リスト要素のid
 * @param {string} cityid 市区町村リスト要素のid
 * @description 都道府県リスト（上位リスト）に紐づく、市区町村リストを設定する。
 * @author Y.Y
 * @version 1.0.0
 */
const setCityList = async (prefectureid, cityid) => {

    //当システムではfetchにより市区町村JSONを丸々ダウンロードしており、データ量の増加によりトラフィック増加が懸念
    //されるが、テスト用アプリのため、このままとする。
    //(なお、PHP等のサーバサイドスクリプトから取得するようにした場合は、サーバ側でデータを絞り込めるので、上記の問題は解消される。）
    // let cityJson = new common.JsonList('./json/city.json', '市区町村');
    let cityJson = common.JsonListFactory.of('./json/city.json', '市区町村');
    const data = await cityJson.get();

    const prefectureElem = document.getElementById(prefectureid);

    const cityElem = document.getElementById(cityid);
    cityElem.options.length = 1

    const cityIndex = data.findIndex(x => x.prefectureCd === prefectureElem.value);
    const cityInfo = data[cityIndex].cityInfo;

    for (let i in cityInfo){
        let optionElem = document.createElement("option");
        let value = cityInfo[i];
        optionElem.value = value.cd;
        optionElem.text = value.name;
        cityElem.appendChild(optionElem);
    };
}

/**
 * 市区町村リスト設定メソッドのエラーハンドラ捕捉用ラッパーメソッド
 * @method
 * @param {string} prefectureid 都道府県リスト要素のid
 * @param {string} cityid 市区町村リスト要素のid
 * @description setCityListは、都道府県リストのonchangeイベント時と、DB読込み時（データの件数分）に参照されるが、\
 *              setCityList内でエラーハンドラを捕捉するとDB読込み時にエラー発生が発生した場合、都度エラーが発生することになる事から、\
 *              setCityList内でのエラーハンドラを捕捉しないようにした。\
 *              上記理由による代替対応として、都道府県リストのonchangeイベント時（ループ内で複数参照時）にsetCityListを参照する場合は、\
 *              当メソッドを経由する事。
 * @author Y.Y
 * @version 1.0.0
 */
const setCityListWithErrHandler = async (prefectureid, cityid) => {

    try{
        await setCityList(prefectureid, cityid);
    }catch(err){
        window.alert(err);
        console.log(err,"error");
    }
}

/**
 * 適格請求書発行事業者名設定メソッド
 * @method
 * @param {string} tekikakuNoElemId 適格請求書発行事業者No要素のid
 * @param {string} tekikakuNameElemId 適格請求書発行事業者名要素のid
 * @description 適格請求書発行事業者Noに紐づく、適格請求書発行事業者名を設定する。
 * @author Y.Y
 * @version 1.0.0
 */
const setTekikaku = async (tekikakuNoElemId, tekikakuNameElemId) => {

    try{
        let tekikakuNoElem = document.getElementById(tekikakuNoElemId);
        let tekikakuNameElem = document.getElementById(tekikakuNameElemId);
        if (tekikakuNoElem.value.trim() == '') {
            tekikakuNameElem.innerText ='';
            return;
        }

        if (common.isTekikakuNoFormat(tekikakuNoElem.value) == false){
            //適格請求書発行事業者Noが[T+数字13桁]の形式でないとき
            window.alert(common.getMessage('inf007'));
            tekikakuNoElem.value = '';
            tekikakuNameElem.innerText ='';
            return;
        }

        let tekikakuInfo = await common.getTekikaku(tekikakuNoElem.value);

        tekikakuNameElem.innerText = tekikakuInfo.name;

    }catch(err){
        window.alert(err);
        console.log(err,"error");
        document.getElementById(tekikakuNoElemId).value = '';
        document.getElementById(tekikakuNameElemId).innerText = '';
    }
}

/**
 * 行追加メソッド
 * @method
 * @description 明細テーブルに行を追加する。
 * @return {object} 追加行に設定した各要素のid
 * @author Y.Y
 * @version 1.0.0
 */
const rowAdd = () => {
    const tableElem = document.getElementById('detailTable');
    let listIndex = tableElem.rows.length;

    //行追加
    const trElem = tableElem.tBodies[0].insertRow(-1);
    trElem.setAttribute('class', 'trDetail');

    //連動リスト原本（上位リスト）をコピーし、新規行へ追加
    let listElem = document.getElementById('prefectureMaster');
    let cloneListElem = listElem.cloneNode(true);
    cloneListElem.id = 'prefecture'+listIndex;
    let cellElem = trElem.insertCell(0);
    cellElem.setAttribute('name','tdDetail');
    cellElem.appendChild(cloneListElem);

    //連動リスト原本（下位リスト）をコピーし、新規行へ追加
    listElem = document.getElementById('cityMaster');
    cloneListElem = listElem.cloneNode(true);
    cloneListElem.id = 'city'+listIndex;
    cellElem = trElem.insertCell(1);
    cellElem.setAttribute('name','tdDetail');
    cellElem.appendChild(cloneListElem);

    //上位リストのonchangeイベントに、setCityList(エラー捕捉用)をバインド
    document.getElementById('prefecture'+listIndex).onchange = setCityListWithErrHandler.bind(null, 'prefecture'+listIndex, 'city'+listIndex);

    //テキスト要素作成し、適格請求書発行事業者No入力欄として新規行へ追加
    let textElem = document.createElement("input");
    textElem.id = 'tekikakuNo'+listIndex;
    textElem.setAttribute('class', 'tekikakuNo');
    textElem.setAttribute('maxlength', '14');
    cellElem = trElem.insertCell(2);
    cellElem.setAttribute('name','tdDetail');
    cellElem.appendChild(textElem);

    //ラベル要素作成し、適格請求書発行事業者名表示欄として新規行へ追加
    let labelElem = document.createElement("label");
    labelElem.id = 'tekikakuName'+listIndex;
    labelElem.setAttribute('class', 'tekikakuName');
    cellElem = trElem.insertCell(3);
    cellElem.setAttribute('name','tdDetail');
    cellElem.appendChild(labelElem);

    //onblurイベントに、setTekikakuをバインド
    document.getElementById('tekikakuNo'+listIndex).onblur = setTekikaku.bind(null, 'tekikakuNo'+listIndex, 'tekikakuName'+listIndex);

    //チェックボックス要素作成し、新規行へ追加
    let cbElem = document.createElement("input");
    cbElem.setAttribute('type','checkbox');
    cbElem.id = 'selection'+listIndex;
    cbElem.setAttribute('name','selection');
    cellElem = trElem.insertCell(4);
    cellElem.setAttribute('name','tdDetail');
    cellElem.setAttribute('align','center')
    cellElem.appendChild(cbElem);

    return {prefectureElemID:'prefecture'+listIndex, 
            cityElemID:'city'+listIndex, 
            tekikakuNoElemID:'tekikakuNo'+listIndex, 
            tekikakuNameElemID:'tekikakuName'+listIndex};

}
// 行追加ボタン押下時イベントリスナー
document.getElementById('addRowButton').addEventListener('click', () => rowAdd());

/**
 * 行削除メソッド
 * @method
 * @description 選択チェックボックスにチェックされている行をテーブルから削除する。
 * @author Y.Y
 * @version 1.0.0
 */
const rowDel = () => {
    //全行のリストボックス要素を取得
    const cbSelections = document.getElementsByName('selection');
    //チェックのついている行を削除
    for (let i = cbSelections.length-1; 0 <= i; i--){
        const chkboxElem = cbSelections[i];
        if(chkboxElem.checked){
            const elemTr = chkboxElem.parentNode.parentNode;
            elemTr.parentNode.deleteRow(elemTr.rowIndex);
        }
    }
}
//行削除ボタン押下時イベントリスナー
document.getElementById('delRowButton').addEventListener('click', () => rowDel());

/**
 * 参照ボタンクリック時メソッド
 * @method
 * @description 登録IDに該当するデータをDBから取得し、明細テーブルに設定する。
 * @author Y.Y
 * @version 1.0.0
 */
const searchButtonClick = async () => {
    try {
        const registIDElem = document.getElementById('registID');     //登録ID

        if (registIDElem.value.trim() == ''){
            //登録ID未入力時エラー
            window.alert(common.getMessage('inf008'));
            return;
        }

        //非同期通信によるDBからのデータ取得
        const data = await common.searchDB(registIDElem.value);

        //先頭行以外削除
        const tableElem = document.getElementById('detailTable');
        while (tableElem.rows.length > 1) tableElem.deleteRow(1);

        //取得した値を明細テーブルに追加
        for (let i in data){
            let result = rowAdd();
            document.getElementById(result.prefectureElemID).value = data[i].prefecture;
            await setCityList(result.prefectureElemID, result.cityElemID);
            document.getElementById(result.cityElemID).value = data[i].city;
            document.getElementById(result.tekikakuNoElemID).value = data[i].tekikakuNo;
            document.getElementById(result.tekikakuNameElemID).innerText = data[i].tekikakuName;
        };

        //コントロールの入力可否設定
        let canDetailInput = document.getElementById('registMode').dbRegistMode.value == 'delete';
        controlSetting(true, canDetailInput);

        //読み込み完了メッセージ
        window.alert(common.getMessage('inf001'));

    }catch (err) {
        window.alert(err);
        console.log(err,"error");
    }
}
// 参照ボタン押下時イベントリスナー
document.getElementById('searchButton').addEventListener('click', searchButtonClick.bind(this));

/**
 * DBへのデータ登録プロセスメソッド
 * @method
 * @description 明細テーブルに設定されたデータを配列に格納した後、DBへのデータ登録用メソッドを実行する。
 * @author Y.Y
 * @version 1.0.0
 */
const registProcess = async () => {

    try {
        const registIDElem = document.getElementById('registID');

        const tableElem = document.getElementById('detailTable');
        const rowElems = tableElem.rows;

        //detailTableテーブルに入力された内容を配列(registData)に設定
        let registData = null;
        for (let i = 1; i < rowElems.length; i++) {
            //対象行の各要素取得
            const tdElem = rowElems[i].children;
            const prefectureElem = tdElem[0].children[0];
            const cityElem = tdElem[1].children[0];
            const tekikakuNoElem = tdElem[2].children[0];
            const tekikakuNameElem = tdElem[3].children[0];
            const chkboxElem = tdElem[4].children[0];

            //削除チェックボックスが選択されている行又は、上位リストが未選択の行は除外する。
            if (chkboxElem.checked) continue;
            if (prefectureElem.value == '') continue;

            //配列(registData)に、対象行の値を追加
            if (registData == null) {
                registData = { [i] : {registID: registIDElem.value, 
                                   rowNo: i, 
                                   prefecture: prefectureElem.value, 
                                   city: cityElem.value, 
                                   tekikakuNo: tekikakuNoElem.value, 
                                   tekikakuName: tekikakuNameElem.innerText}
                          };
            }else{
                registData = Object.assign( registData, { [i] : {registID: registIDElem.value, 
                                                           rowNo: i, 
                                                           prefecture: prefectureElem.value, 
                                                           city: cityElem.value, 
                                                           tekikakuNo: tekikakuNoElem.value, 
                                                           tekikakuName: tekikakuNameElem.innerText}
                                                  }
                                       );
            }
        }

        if (registData == null){
            //明細テーブルに登録対象データが１行も存在しないときのエラー
            window.alert(common.getMessage('inf004'));
            return;
        }

        //非同期通信によるDBへのデータ登録
        const processedRegistID = await common.registDB(registData);

        //DB反映されたデータの登録ID（新規登録時は、新規採番された登録ID）
        registIDElem.value = processedRegistID;

        //行削除チェックボックスが選択されている行の削除
        rowDel();

        //登録完了メッセージ
        window.alert(common.getMessage('inf002') + processedRegistID);

    }catch (err) {
        window.alert(err);
        console.log(err,"error");
    }
}

/**
 * DBからのデータ削除プロセスメソッド
 * @method
 * @description 削除対象の登録ID取得後、DBからのデータ削除用メソッドを実行する。
 * @author Y.Y
 * @version 1.0.0
 */
const deleteProcess = async () => {
    try {
        const registIDElem = document.getElementById('registID');     //登録ID

        //非同期通信によるDBへのデータ登録
        const processedRegistID = await common.deleteDB(registIDElem.value);

        //削除完了メッセージ
        window.alert(common.getMessage('inf005') + processedRegistID);

    }catch (err) {
        window.alert(err);
        console.log(err,"error");
    }
}

/**
 * DB反映ボタンクリック時メソッド
 * @method
 * @description 登録モードで「新規・更新」選択時は、DBへのデータ登録用メソッドを実行し、\
 * 登録モードで「削除」選択時は、DBからデータ削除用メソッドを実行する。
 * @author Y.Y
 * @version 1.0.0
 */
const reflectDBButtonClick = () => {
    if (document.getElementById('registMode').dbRegistMode.value != 'delete') {
        //DBへのデータ登録用メソッド
        registProcess();
    } else {
        //DBからデータ削除用メソッド
        deleteProcess();
    }
}
// DB反映ボタン押下時イベントリスナー
document.getElementById('reflectDBButton').addEventListener('click', reflectDBButtonClick.bind(this));

/**
 * リセット時メソッド
 * @method
 * @description 画面のコントロール類を初期状態にリセットする。
 * @author Y.Y
 * @version 1.0.0
 */
const reset = () => {
    //コントロールの入力可否設定
    controlSetting();

    document.getElementById('registID').value = '';

    //登録モードを更新に設定
    document.getElementById('registMode').dbRegistMode.value = 'update';

    //先頭行以外削除
    const tableElem = document.getElementById('detailTable');
    while (tableElem.rows.length > 1) tableElem.deleteRow(1);
}
// リセットボタン押下時イベントリスナー
document.getElementById('resetButton').addEventListener('click', reset.bind(this));

/**
 * 新規登録モード切替えメソッド
 * @method
 * @description 画面のコントロール類を新規登録モードに切り替える。
 * @author Y.Y
 * @version 1.0.0
 */
const newRegist = () => {

    //コントロールの入力可否設定
    controlSetting(true);

    document.getElementById('registID').value = '';

    //先頭行以外削除
    const tableElem = document.getElementById('detailTable');
    while (tableElem.rows.length > 1) tableElem.deleteRow(1);

    //新規行追加
    for (let i = 0; i < 10; i++){
        rowAdd();
    }
}

/**
 * 削除モード切替えメソッド
 * @method
 * @description 画面のコントロール類を削除モードに切り替える。
 * @author Y.Y
 * @version 1.0.0
 */
const deleteData = () => {
        //コントロールの入力可否設定
        controlSetting();
    
        document.getElementById('registID').value = '';

        //先頭行以外削除
        const tableElem = document.getElementById('detailTable');
        while (tableElem.rows.length > 1) tableElem.deleteRow(1);
}

// 登録モードラジオボタン変更時イベントリスナー
const registMode = document.getElementById('registMode');
registMode.addEventListener('change', () => {
    switch (registMode.dbRegistMode.value) {
        case 'insert': newRegist();
        break;
        case 'update': reset();
        break;
        case 'delete': deleteData();
        break;
        default:  throw new Error(common.getMessage('err999'));
    }
});

/**
 * コントロールの入力可否設定メソッド
 * @method
 * @param {boolean} canInputMode コントロールを入力用のモードに切り替えるか（初期値:false）
 * @param {boolean} canDetailReadOnly 明細テーブルを読み取り専用に切り替えるか（初期値:false）
 * @description 画面のコントロール類を削除モードに切り替える。
 * @author Y.Y
 * @version 1.0.0
 */
const controlSetting = (canInputMode = false, canDetailReadOnly = false) => {

    if ( canInputMode == false ){
        //リセットモード
        document.getElementById('registID').disabled = false;

        document.getElementById('searchButton').disabled = false;
        document.getElementById('reflectDBButton').disabled = true;
        document.getElementById('addRowButton').disabled = true;
        document.getElementById('delRowButton').disabled = true;

    } else {
        //入力モード
        document.getElementById('registID').disabled = true;

        document.getElementById('searchButton').disabled = true;
        document.getElementById('reflectDBButton').disabled = false;
        document.getElementById('addRowButton').disabled = false;
        document.getElementById('delRowButton').disabled = false;
    }

    if ( canDetailReadOnly == true ){
        //明細読み取り専用時
        document.getElementById('addRowButton').disabled = true;
        document.getElementById('delRowButton').disabled = true;

        let list = document.getElementsByName('tdDetail');
        for (let elem of list){
            elem.childNodes[0].disabled = true;
        }
    }
}

/**
 * ロードイベント
 * @method
 * @author Y.Y
 * @version 1.0.0
 */
window.onload = () => {

    try{
        //コントロールの入力可否設定
        controlSetting();

        setPrefectureList();

    }catch(err){
        window.alert(err);
        console.log(err,"error");
    }

}

//WebAPIからの値取得 start
document.getElementById('inputID').addEventListener('blur', () => {
    const result1 = document.getElementById('result1');
    const result2 = document.getElementById('result2');
    const result3 = document.getElementById('result3');

    result1.innerHTML = "";
    result2.innerHTML = "";
    result3.innerHTML = "";

    fetch('https://jsonplaceholder.typicode.com/users/'+inputID.value , { 		    // 第1引数に送り先を指定する。
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            switch (response.status) {
                case 400: throw new Error(common.getMessage('err400'));
                case 401: throw new Error(common.getMessage('err401'));
                case 404: throw new Error(common.getMessage('err404'));
                case 500: throw new Error(common.getMessage('err500'));
                default:  throw new Error(common.getMessage('err999'));
            }
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        result1.innerHTML = "ID: "+ data.id;
        result2.innerHTML = "name: "+ data.name;
        result3.innerHTML = "site: "+ data.website;
    })
    .catch(error => {
        console.log(error);
        result1.innerHTML = error;
    });
});
//WebAPIからの値取得 end
