'use strict';

import gMessageJson from "../json/message.json" with { type: "json" };
import * as common from './common.js';

//都道府県リスト設定メソッド
const setPrefectureList = async () => {
    try {

        // 都道府県JSONリストの取得
        let prefectureJson = new common.JsonList("./json/prefecture.json", "都道府県");
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

//市区町村リスト設定メソッド（都道府県リスト（上位リスト）に紐づく、市区町村リスト取得メソッド）
//(上位リストのonchangeイベントにバインドされ実行される。)
//(fetchによりJSONファイルを丸々ダウンロードするので、本来であれば画面読み込み時に一度ダウンロード
//(すればよいが、テスト用アプリのため、このままとする。)
//(なお、PHP等のサーバサイドスクリプトから取得するようにした場合は、サーバ側でデータを絞り込めるので、
//(onchangeイベント発生都度fetchによりデータ取得をするのは、有効な手段となる。)
const setCityList = async (prefectureid, cityid) => {

    // 市区町村JSONリストの取得
    let cityJson = new common.JsonList("./json/city.json", "市区町村");
    // let cityJson = common.JsonListFactory.of("./json/city.json", "市区町村");

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

//市区町村リスト設定メソッドのエラーハンドラ捕捉用ラッパーメソッド
const setCityListWithErrHandler = async (prefectureid, cityid) => {

    try{
        await setCityList(prefectureid, cityid);
    }catch(err){
        window.alert(err);
        console.log(err,"error");
    }
}

//適格請求書発行事業者名設定メソッド
const setTekikaku = async (tekikakuNoElemId, tekikakuNameElemId) => {

    try{
        let tekikakuNoElem = document.getElementById(tekikakuNoElemId);
        let tekikakuNameElem = document.getElementById(tekikakuNameElemId);
        if (tekikakuNoElem.value.trim() == '') {
            tekikakuNameElem.innerText ='';
            return;
        }

        if (common.isTekikakuCdFormat(tekikakuNoElem.value) == false){
            //適格請求書発行事業者コードが[T+数字13桁]の形式でないとき
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
    }
}

//行追加メソッド
const rowAdd = () => {
    const tableElem = document.getElementById('sample-table');
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

    //テキスト要素作成し、適格請求書発行事業者コード入力欄として新規行へ追加
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
document.getElementById('tableRowAdd').addEventListener('click', () => rowAdd());

// 行削除ボタン押下時イベントリスナー
//document.getElementById('tableRowDel').addEventListener('click', () => {
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
document.getElementById('tableRowDel').addEventListener('click', () => rowDel());

//DB参照時メソッド
const searchDB = async () => {
    try {
        const registIDElem = document.getElementById('registID');     //登録ID

        if (registIDElem.value.trim() == ''){
            window.alert("登録IDを半角数字で入力してください。");
            return;
        }

        //先頭行以外削除
        const tableElem = document.getElementById('sample-table');
        while (tableElem.rows.length > 1) tableElem.deleteRow(1);

        //非同期通信によるDBからのデータ取得
        const res = await fetch("./script/fetch_select.php", { 					
            method: 'POST', 									
            headers: { 'Content-Type': 'application/json' }, 	
            body: JSON.stringify(registIDElem.value) 							
        });
        const data = await res.json();

        if (data.length == 0 ){
            //登録データ0件時エラーメッセージ
            window.alert(common.getMessage('inf003'));
            return;
        }

        //取得した値をテーブルに追加
        for (let i in data){
            let result = rowAdd();
            document.getElementById(result.prefectureElemID).value = data[i].prefecture;
            await setCityList(result.prefectureElemID, result.cityElemID);
            document.getElementById(result.cityElemID).value = data[i].city;
            document.getElementById(result.tekikakuNoElemID).value = data[i].tekikakuNo;
            document.getElementById(result.tekikakuNameElemID).innerText = data[i].tekikakuName;
        };

        //コントロールの入力可否設定
//        controlSetting(true);
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
document.getElementById('dbSearch').addEventListener('click', searchDB.bind(this));

//DB登録時メソッド
const registDB = async () => {

    try {
        const registIDElem = document.getElementById('registID');

        const tableElem = document.getElementById('sample-table');
        const rowElems = tableElem.rows;

        //sample-tableテーブルに入力された内容を配列(tdArray)に設定
        let tdArray = null;
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

            //配列(tdArray)に、対象行の値を追加
            if (tdArray == null) {
                tdArray = { [i] : {registID: registIDElem.value, 
                                   rowNo: i, 
                                   prefecture: prefectureElem.value, 
                                   city: cityElem.value, 
                                   tekikakuNo: tekikakuNoElem.value, 
                                   tekikakuName: tekikakuNameElem.innerText}
                          };
            }else{
                tdArray = Object.assign( tdArray, { [i] : {registID: registIDElem.value, 
                                                           rowNo: i, 
                                                           prefecture: prefectureElem.value, 
                                                           city: cityElem.value, 
                                                           tekikakuNo: tekikakuNoElem.value, 
                                                           tekikakuName: tekikakuNameElem.innerText}
                                                  }
                                       );
            }
        }

        if (tdArray == null){
            window.alert(common.getMessage('inf004'));
            return;
        }

        //非同期通信によるDBへのデータ登録
        const res = await fetch("./script/fetch_regist.php", { 					
            method: 'POST', 									
            headers: { 'Content-Type': 'application/json' }, 	
            body: JSON.stringify(tdArray) 							
        });
        const data = await res.json();

        //登録されたデータの登録ID
        registIDElem.value = data.registID;

        //行削除チェックボックスが選択されている行の削除
        rowDel();

        window.alert(common.getMessage('inf002')+data.registID);

    }catch (err) {
        window.alert(err);
        console.log(err,"error");
    }
}

//DB登録時メソッド
const deleteDB = async () => {
    try {
        const registIDElem = document.getElementById('registID');     //登録ID

        if (registIDElem.value.trim() == ''){
            window.alert("登録IDを半角数字で入力してください。");
            return;
        }

        //非同期通信によるDBからのデータ削除
        const res = await fetch("./script/fetch_delete.php", { 					
            method: 'POST', 									
            headers: { 'Content-Type': 'application/json' }, 	
            body: JSON.stringify(registIDElem.value) 							
        });
        const data = await res.json();

        // //削除されたデータの登録ID
        // registIDElem.value = data.registID;

        window.alert(common.getMessage('inf005')+data.registID);

    }catch (err) {
        window.alert(err);
        console.log(err,"error");
    }
}

const registButtonClick = () => {
    if (document.getElementById('registMode').dbRegistMode.value != 'delete') {
        registDB();
    } else {
        deleteDB();
    }
}

// DB登録ボタン押下時イベントリスナー
document.getElementById('registButton').addEventListener('click', registButtonClick.bind(this));

//リセット時メソッド
const reset = () => {
    //コントロールの入力可否設定
    controlSetting();

    document.getElementById('registID').value = '';

    //登録モードを更新に設定
    document.getElementById('registMode').dbRegistMode.value = 'update';

    //先頭行以外削除
    const tableElem = document.getElementById('sample-table');
    while (tableElem.rows.length > 1) tableElem.deleteRow(1);
}
// リセットボタン押下時イベントリスナー
document.getElementById('reset').addEventListener('click', reset.bind(this));

//新規登録モード切替え時メソッド
const newRegist = () => {

    //コントロールの入力可否設定
    controlSetting(true);

    document.getElementById('registID').value = '';

    //先頭行以外削除
    const tableElem = document.getElementById('sample-table');
    while (tableElem.rows.length > 1) tableElem.deleteRow(1);

    //新規行追加
    rowAdd();
}

//削除モード切り替えメソッド時メソッド
const deleteData = () => {
        //コントロールの入力可否設定
        controlSetting();
    
        document.getElementById('registID').value = '';

        //先頭行以外削除
        const tableElem = document.getElementById('sample-table');
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

//コントロールの入力可否設定
const controlSetting = (canInputMode = false, canDetailReadOnly = false) => {

    if ( canInputMode == false ){
        //リセットモード
        document.getElementById('registID').disabled = false;

        document.getElementById('dbSearch').disabled = false;
        document.getElementById('registButton').disabled = true;
        document.getElementById('tableRowAdd').disabled = true;
        document.getElementById('tableRowDel').disabled = true;

    } else {
        //入力モード
        document.getElementById('registID').disabled = true;

        document.getElementById('dbSearch').disabled = true;
        document.getElementById('registButton').disabled = false;
        document.getElementById('tableRowAdd').disabled = false;
        document.getElementById('tableRowDel').disabled = false;
    }

    if ( canDetailReadOnly == true ){
        //明細読み取り専用時
        document.getElementById('tableRowAdd').disabled = true;
        document.getElementById('tableRowDel').disabled = true;

        let list = document.getElementsByName('tdDetail');
        for (let elem of list){
            elem.childNodes[0].disabled = true;
        }
    }

}

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
