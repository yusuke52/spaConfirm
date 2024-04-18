'use strict';

import gMessageJson from "../json/message.json" with { type: "json" };

// /**
//  * JSONリスト取得クラス
//  * @class
//  * @classdesc filePathに該当するJSONオブジェクトを取得する
//  * @param {string} filePath ファイルパス
//  * @param {string} displayName 表示用ファイル名
//  * @throws {Error} this.displayName+'データが0件です。'
//  * @author Y.Y
//  * @version 1.0.0
//  */
// export class JsonList{

//     constructor(filePath, displayName=''){
//         this.filePath = filePath;
//         this.displayName = displayName;
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

//         if (data.length == 0 ) {
//             //JSONファイル0件エラー
//             throw new Error(this.displayName + getMessage('err001'));
//         }

//         return data;
//     }
// }

/**
 * JSONリスト取得クラス
 * @class
 * @classdesc filePathに該当するJSONオブジェクトを取得する
 * @param {string} filePath ファイルパス
 * @param {string} displayName 表示用ファイル名
 * @return {object} filePathに該当するJSONオブジェクト
 * @description ofメソッド（Factoryメソッド）経由でインスタンスを生成すること。
 * @example let exampleJson = common.JsonListFactory.of('./json/example.json', 'JSON名');
 * @description インスタンス生成後、getメソッドによりJSONオブジェクトを取得可能。
 * @example const jsonObj = exampleJson.get();
 * @throws {Error} 'JSON名' + 'データが0件です。'
 * @author Y.Y
 * @version 1.0.0
 */
export class JsonListFactory{

    //インスタンスをキャッシュするための静的プロパティ
    static #_cache = new Map();

    #_filePath = null;
    #_displayName = null;

    //ＪSONファイルから取得したJSONオブジェクトが格納されているプロパティ
    #_data = null;

    constructor(filePath, displayName=''){
        this.#_filePath = filePath;
        this.#_displayName = displayName;
    }

    /**
     * インスタンス取得メソッド
     * @method
     * @param {string} filePath ファイルパス
     * @param {string} displayName 表示用ファイル名
     * @return {object} filePath毎に生成されたインスタンス
     * @description インスタンスを生成するための静的メソッド
     * @author Y.Y
     * @version 1.0.0
     */
    static of(filePath, displayName='') {
        //キャッシュが存在する場合は、そのまま返す
        if(this.#_cache.has(filePath)){
            return this.#_cache.get(filePath);
        }
        //そうでなければ、新規インスタンスを生成＆キャッシュに登録
        let instance = new JsonListFactory(filePath, displayName);

        this.#_cache.set(filePath, instance);
        return instance;
    }

    /**
     * JSONオブジェクト取得メソッド
     * @method
     * @return {object} JSONオブジェクト
     * @description インスタンス生成時に指定したfilePathに該当するJSONオブジェクトを取得する。
     * @author Y.Y
     * @version 1.0.0
     */
    async get () {
        if (this.#_data == null) {
            //JSONデータ取得
            const res = await fetch(this.#_filePath);

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
                throw new Error(this.#_displayName + getMessage('err001'));
            }

            this.#_data = data;

        }

        return this.#_data;
    }
}

/**
 * メッセージ取得メソッド
 * @method
 * @param {string} cd メッセージコード
 * @return {string} メッセージコードに該当するメッセージ内容
 * @author Y.Y
 * @version 1.0.0
 */
export const getMessage = (cd) => {
    try {
        const messageIndex = gMessageJson.findIndex(x => x.cd === cd);
        return gMessageJson[messageIndex].message;
    }catch (err) {
        window.alert(err);
        console.log(err,"error");
    }
}

/**
 * DB参照メソッド
 * @method
 * @param {string} registID 登録ID
 * @return {object} 登録IDによりDBから取得したデータ
 * @description 登録IDに該当するデータをDBから取得する。
 * @throws {Error} 登録IDに該当するデータ未存在時エラー
 * @author Y.Y
 * @version 1.0.0
 */
export const searchDB = async (registID) => {
    //非同期通信によるDBからのデータ取得
    const res = await fetch("./script/fetch_select.php", { 					
        method: 'POST', 									
        headers: { 'Content-Type': 'application/json' }, 	
        body: JSON.stringify(registID) 							
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
        //コードに該当するデータが存在しないとき
        throw new Error(getMessage('inf003'));
    }

    return data;
}

/**
 * DBへのデータ登録メソッド
 * @method
 * @param {object} registData 配列データ（登録データ）
 * @return {string} 登録されたデータの登録ID（新規登録時は、新規採番された登録ID）
 * @description 配列データをDBへ登録する。
 * @author Y.Y
 * @version 1.0.0
 */
export const registDB = async (registData) => {

    //非同期通信によるDBへのデータ登録
    const res = await fetch("./script/fetch_regist.php", { 					
        method: 'POST', 									
        headers: { 'Content-Type': 'application/json' }, 	
        body: JSON.stringify(registData) 							
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

    //登録されたデータの登録ID（新規登録時は、新規採番された登録ID）
    return data.registID;

}

/**
 * DBからのデータ削除メソッド
 * @method
 * @param {string} registID 削除対象の登録ID
 * @return {string} 削除されたデータの登録ID
 * @description 登録IDに該当するデータをDBから削除する。
 * @author Y.Y
 * @version 1.0.0
 */
export const deleteDB = async (registID) => {

    //非同期通信によるDBからのデータ削除
    const res = await fetch("./script/fetch_delete.php", { 					
        method: 'POST', 									
        headers: { 'Content-Type': 'application/json' }, 	
        body: JSON.stringify(registID) 							
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

    //削除されたデータの登録ID
    return data.registID;

}

/**
 * 適格請求書発行事業Noフォーマットチェックメソッド
 * @method
 * @param {string} cd 適格請求書発行事業No
 * @return {boolean} 書式の適合有無
 * @description 取得した適格請求書発行事業Noが[T+数字13桁]の書式に適合するかチェックする
 * @author Y.Y
 * @version 1.0.0
 */
export const isTekikakuNoFormat = (cd) => {
    let tekikakuNoFormat = /^T[0-9]{13}$/;
    return tekikakuNoFormat.test(cd);
}

/**
 * 適格請求書発行事業者情報取得メソッド
 * @method
 * @param {string} cd 適格請求書発行事業No
 * @return {object} 適格請求書発行事業者情報JSONオブジェクト
 * @description 取得した適格請求書発行事業Noに該当する適格請求書発行事業者情報JSONオブジェクトを取得する。
 * @throws {Error} 指定したコードに該当する適格請求書発行事業者名の未存在時エラー
 * @author Y.Y
 * @version 1.0.0
 */
export const getTekikaku = async (cd) => {
    //非同期通信によるデータ取得
    const res = await fetch("./script/fetch_sel_tekikaku.php", { 					
        method: 'POST', 									
        headers: { 'Content-Type': 'application/json' }, 	
        body: JSON.stringify(cd) 							
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

