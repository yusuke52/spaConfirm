'use strict';

import gMessageJson from "../json/message.json" with { type: "json" };

class JsonList{

    constructor(filePath, displayName=''){
        this.filePath = filePath;
        this.displayName = displayName;
    }

    //JSONリスト取得処理
    async get () {
        //JSONデータ取得
        const res = await fetch(this.filePath);

        if (!res.ok) {
            switch (res.status) {
                case 400: throw new Error(getMessage('err400'));
                case 401: throw new Error(getMessage('err401'));
                case 404: throw new Error(getMessage('err404'));
                case 500: throw new Error(getMessage('err500'));
                default:  throw new Error(getMessage('err999'));
            }
        }

        const data = await res.json();

        if (data.length == 0 ) throw new Error(this.displayName+'データが0件です。');

        return data;
    }
}

//都道府県リスト取得メソッド
const setPrefectureList = async () => {
    try {

        // 都道府県JSONリストの取得
        let prefectureJson = new JsonList("./json/prefecture.json", "都道府県");
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

//市区町村リスト取得メソッド（都道府県リスト（上位リスト）に紐づく、市区町村リスト取得メソッド）
//(上位リストのonchangeイベントにバインドされ実行される。)
//(fetchによりJSONファイルを丸々ダウンロードするので、本来であれば画面読み込み時に一度ダウンロード
//(すればよいが、テスト用アプリのため、このままとする。)
//(なお、PHP等のサーバサイドスクリプトから取得するようにした場合は、サーバ側でデータを絞り込めるので、
//(onchangeイベント発生都度fetchによりデータ取得をするのは、有効な手段となる。)
const setCityList = async (prefectureid, cityid) => {

    // 市区町村JSONリストの取得
    let cityJson = new JsonList("./json/city.json", "市区町村");
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

//市区町村リスト取得メソッドのエラーハンドラ捕捉用ラッパーメソッド
const setCityListWithErrHandler = async (prefectureid, cityid) => {

    try{
        await setCityList(prefectureid, cityid);
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
    //チェックボックス要素作成し、新規行へ追加
    let cbElem = document.createElement("input");
    cbElem.setAttribute('type','checkbox');
    cbElem.id = 'selection'+listIndex;
    cbElem.setAttribute('name','selection');
    let cellElem = trElem.insertCell(0);
    cellElem.appendChild(cbElem);

    //連動リスト原本（上位リスト）をコピーし、新規行へ追加
    let listElem = document.getElementById('prefectureMaster');
    let cloneListElem = listElem.cloneNode(true);
    cloneListElem.id = 'prefecture'+listIndex;
    cellElem = trElem.insertCell(1);
    cellElem.appendChild(cloneListElem);

    //連動リスト原本（下位リスト）をコピーし、新規行へ追加
    listElem = document.getElementById('cityMaster');
    cloneListElem = listElem.cloneNode(true);
    cloneListElem.id = 'city'+listIndex;
    cellElem = trElem.insertCell(2);
    cellElem.appendChild(cloneListElem);

    //上位リストのonchangeイベントに、setCityList(エラー捕捉用)をバインド
    document.getElementById('prefecture'+listIndex).onchange = setCityListWithErrHandler.bind(null, 'prefecture'+listIndex, 'city'+listIndex);
    
    return {prefectureElemID:'prefecture'+listIndex, cityElemID:'city'+listIndex};

}
// 行追加ボタン押下時イベントリスナー
document.getElementById('tableRowAdd').addEventListener('click', () => rowAdd());

// 行削除ボタン押下時イベントリスナー
document.getElementById('tableRowDel').addEventListener('click', () => {
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
});

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
            window.alert(getMessage('inf003'));
            return;
        }

        //取得した値をテーブルに追加
        for (let i in data){
            let result = rowAdd();
            document.getElementById(result.prefectureElemID).value = data[i].prefecture;
            await setCityList(result.prefectureElemID, result.cityElemID);
            document.getElementById(result.cityElemID).value = data[i].city;
        };

        //コントロールの入力可否設定
        controlSetting(true,true);

        //読み込み完了メッセージ
        window.alert(getMessage('inf001'));

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
            const chkboxElem = tdElem[0].children[0];
            const prefectureElem = tdElem[1].children[0];
            const cityElem = tdElem[2].children[0];

            //削除チェックボックスが選択されている行又は、上位リストが未選択の行は除外する。
            if (chkboxElem.checked) continue;
            if (prefectureElem.value == '') continue;

            //配列(tdArray)に、対象行の値を追加
            if (tdArray == null) {
                tdArray = {[i] : {registID:registIDElem.value, rowNo:i, prefecture:prefectureElem.value, city:cityElem.value}} ;
            }else{
                tdArray = Object.assign(tdArray, { [i] : {registID:registIDElem.value, rowNo:i, prefecture:prefectureElem.value, city:cityElem.value} });
            }
        }

        if (tdArray == null){
            window.alert("登録データがありません。");
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

        window.alert(getMessage('inf002')+data.registID);

    }catch (err) {
        window.alert(err);
        console.log(err,"error");
    }
}
// DB登録ボタン押下時イベントリスナー
document.getElementById('dbRegist').addEventListener('click', registDB.bind(this));

//リセット時メソッド
document.getElementById('reset').addEventListener('click', () => {

    //コントロールの入力可否設定
    controlSetting();

    //先頭行以外削除
    const tableElem = document.getElementById('sample-table');
    while (tableElem.rows.length > 1) tableElem.deleteRow(1);
});

//新規登録モード切替え時メソッド
document.getElementById('newRegist').addEventListener('click', () => {

    //コントロールの入力可否設定
    controlSetting(true);

    //先頭行以外削除
    const tableElem = document.getElementById('sample-table');
    while (tableElem.rows.length > 1) tableElem.deleteRow(1);

    //新規行追加
    rowAdd();
});

//コントロールの入力可否設定
const controlSetting = (canInputMode = false, keepRegistID = false) => {

    if ( canInputMode == false ){
        //リセットモード
        const registIDElem = document.getElementById('registID');
        if ( keepRegistID == false) registIDElem.value = '';
        registIDElem.disabled = false;

        document.getElementById('dbSearch').disabled = false;
        document.getElementById('dbRegist').disabled = true;
        document.getElementById('tableRowAdd').disabled = true;
        document.getElementById('tableRowDel').disabled = true;
    } else {
        //入力モード
        const registIDElem = document.getElementById('registID');
        if (keepRegistID == false) registIDElem.value = '';
        registIDElem.disabled = true;

        document.getElementById('dbSearch').disabled = true;
        document.getElementById('dbRegist').disabled = false;
        document.getElementById('tableRowAdd').disabled = false;
        document.getElementById('tableRowDel').disabled = false;
    }
}

//メッセージ取得メソッド
const getMessage = (cd) => {
    try {
        const messageIndex = gMessageJson.findIndex(x => x.cd === cd);
        return gMessageJson[messageIndex].message;
    }catch (err) {
        window.alert(err);
        console.log(err,"error");
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
                case 400: throw new Error(getMessage('err400'));
                case 401: throw new Error(getMessage('err401'));
                case 404: throw new Error(getMessage('err404'));
                case 500: throw new Error(getMessage('err500'));
                default:  throw new Error(getMessage('err999'));
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
