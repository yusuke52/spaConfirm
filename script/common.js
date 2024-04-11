import gMessageJson from "../json/message.json" with { type: "json" };

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
