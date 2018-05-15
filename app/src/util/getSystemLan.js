export default function getSystemLan(){
    let url="../../language.json";
    return fetch(url) 
    .then(response=>response.json())
    .then(data=>{
       /* var setLanList=document.querySelector('.set_lan_list');

        var ul=document.createElement('ul');
        
        var frag = document.createDocumentFragment();
        data.forEach(function(element) {
            var li=document.createElement('li');
            li.innerHTML=element.lang;
            frag.appendChild(li);
        }, this);
        ul.appendChild(frag);
        setLanList.appendChild(ul);*/

       return data;
    })
    .catch(e=>console.log('error',e));
}