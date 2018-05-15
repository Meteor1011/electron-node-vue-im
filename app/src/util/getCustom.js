import fetch from './fetch.js';

export function getCustom(lan, productId){
    var url = `/imProductAction.aspx?method=getGoodsById`;
    let formData = new FormData();
    formData.append('dataSourceId',lan);
    formData.append('id',productId);
    return fetch({
        url: url,
        method: 'post',
        mode:'cors',
        data: formData
    });
}