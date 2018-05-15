var uuid = require('node-uuid');

export default function insertMsg2DB(msg){
    console.log('insertMSG IN')
    var formdata = new FormData();
    /*let url='http://im.1818lao.com/leading/chatLogAction.aspx?method=insertOrUpdateChatLog';
    
    formdata.append('sender',msg.sender);
    formdata.append('receiver',msg.receiver);
    formdata.append('origBody',msg.origBody);
    formdata.append('transBody',msg.transBody);
    formdata.append('fromLan',msg.fromLan);
    formdata.append('toLan',msg.toLan);
    formdata.append('uuid',msg.uuid || uuid.v1());
    */
    let url='http://im.1818lao.com:3000/insertorupdate';
    
    formdata.append('s',msg.sender);
    formdata.append('r',msg.receiver);
    formdata.append('o',msg.origBody);
    formdata.append('tb',msg.transBody);
    formdata.append('fl',msg.fromLan);
    formdata.append('tl',msg.toLan);
    formdata.append('uuid',msg.uuid || uuid.v1());
    
    fetch(url,{
        method:'POST',
        header:{"Content-Type": "application/x-www-form-urlencoded"},
        mode:'no-cors',
        body:formdata
    });
    
}