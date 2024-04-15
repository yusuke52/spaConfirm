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

        if (data.length == 0 ) throw new Error(this.displayName+'データが0件です。');

        return data;
    }
}

// //JsonList取得クラス
// //ofメソッド（Factoryメソッド）経由でインスタンスを生成すること。
// //インスタンス取得例：let cityJson = common.JsonListFactory.of("./json/city.json", "市区町村");
// export class JsonListFactory{

//     //インスタンスをキャッシュするための静的プロパティ
//     static cache = new Map();

//     constructor(filePath, displayName=''){
//         this.filePath = filePath;
//         this.displayName = displayName;
//     }

//     //インスタンスを生成するための静的メソッド
//     static of(filePath, displayName='') {
//         //キャッシュが存在する場合は、そのまま返す
//         if(this.cache.has(filePath)){
//             return this.cache.get(filePath);
//         }
//         //そうでなければ、新規インスタンスを生成＆キャッシュに登録
//         let jsonObj = new JsonListFactory(filePath, displayName);
//         this.cache.set(filePath, jsonObj);
//         return jsonObj;
//     }

//     //JSONリスト取得処理
//     async get () {
//         //JSONデータ取得
//         const res = await fetch(this.filePath);

//         if (!res.ok) {
//             switch (res.status) {
//                 case 400: throw new Error(getMessage('err400'));
//                 case 401: throw new Error(getMessage('err401'));
//                 case 404: throw new Error(getMessage('err404'));
//                 case 500: throw new Error(getMessage('err500'));
//                 default:  throw new Error(getMessage('err999'));
//             }
//         }

//         const data = await res.json();

//         if (data.length == 0 ) throw new Error(this.displayName+'データが0件です。');

//         return data;
//     }
// }

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

    if (data.length == 0 ) throw new Error('データが見つかりません。');

    return data;
}

