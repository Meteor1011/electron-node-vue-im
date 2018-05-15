export default function getNode(){
    var COS = require('cos-nodejs-sdk-v5');
    var cos = new COS({
        AppId: '1252811222',
        SecretId: 'AKIDVqzua2ZDwPcbLpp4oKbfU4QYSCizEzd3',
        SecretKey: 'KQHuISN4WjiSwBAtNcbKo34qOYXHn4B3',
    });
    return cos;
}