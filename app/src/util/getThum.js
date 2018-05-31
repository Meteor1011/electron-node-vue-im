/*获得好友的头像和名字 */
import fetch from './fetch.js';
var store = require('../store');
function getThum(friendid,unread) {
  unread = unread || false;
  let formData = new FormData();
  formData.append('pid',friendid);
  fetch({
    url: '/memberAction.aspx?method=queryMemberList',
    method: 'post',
    mode:'cors',
    data: formData
  }).then(res=>{  
    let data =JSON.parse(res.data.ret);
    for(var item in data){
        var obj=data[item];
        var friendInfos={
            'headImage':obj.headImage,
            'friendName':obj.memberName,
            'selToID':'UID'+obj.tbMemberId,
            'unRead':unread,
            'offline':false
        }
    }
    store.default.dispatch('add_friends',[friendInfos])
  }).catch(e=>{
      alert('网络超时',e)
  })
}

export default getThum;