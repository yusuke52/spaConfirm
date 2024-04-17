import gMessageJson from "../json/message.json" with { type: "json" };

/**
 * @class
 * @classdesc JSONリスト取得処理
 * @param {string} filePath ファイルパス
 * @param {string} displayName 表示用ファイル名
 * @throws {Error} this.displayName+'データが0件です。'
 * @author Y.Y
 * @version 1.0.0
 */
export class JsonList{

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

        if (data.length == 0 ) {
            //JSONファイル0件エラー
            throw new Error(this.displayName + getMessage('err001'));
        }

        return data;
    }
}

//メッセージ取得メソッド
export const getMessage = (cd) => {
    try {
        const messageIndex = gMessageJson.findIndex(x => x.cd === cd);
        return gMessageJson[messageIndex].message;
    }catch (err) {
        window.alert(err);
        console.log(err,"error");
    }
}

//適格請求書発行事業コードフォーマットチェックメソッド
export const isTekikakuCdFormat = (cd) => {
    let tekikakuCdFormat = /^T[0-9]{13}$/;
    return tekikakuCdFormat.test(cd);

}

//適格請求書発行事業者情報取得メソッド
export const getTekikaku = async (key) => {
    //非同期通信によるデータ取得
    const res = await fetch("./script/fetch_sel_tekikaku.php", { 					
        method: 'POST', 									
        headers: { 'Content-Type': 'application/json' }, 	
        body: JSON.stringify(key) 							
    });

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

    if (data.length == 0 ) {
        //コードに該当する適格請求書発行事業者情報が存在しないとき
        throw new Error(getMessage('inf006'));
    }

    return data;
}

