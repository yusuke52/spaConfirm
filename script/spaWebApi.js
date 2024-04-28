'use strict';

import * as common from './common.js';

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
