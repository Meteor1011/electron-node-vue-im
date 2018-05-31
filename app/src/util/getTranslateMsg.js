import getTrans from './transserver.js';
var store = require('../store');
export function getTranslateMsg(trans){
  let formData = new FormData();
  formData.append('from',trans.from);
  formData.append('to','["'+trans.to+'"]');
  formData.append('msg',trans.text);
  formData.append('uid',trans.uid)
  getTrans({
    url: '/trans/imtrans.action',
    method: 'post',
    mode:'cors',
    data: formData  
  }).then(resp=>{
    let respdata= resp.data;
    if(respdata.code === '000000'){
        let transdata = {
            transText:respdata.result[0].dst,
            uid:respdata.uid
        }
        store.default.dispatch("trans_done",transdata)
    }
  }).catch(e=>{
    let resp = {
        transText:'翻译出错了',
        uid:trans.uid
      }
      store.default.dispatch("trans_done",resp)
      console.log(e)
  });
}