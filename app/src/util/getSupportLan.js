export default function getSupportLan(){
    let url="../../lanList.json";
    return fetch(url) 
    .then(response=>response.json())
    .then(data=>{
        var lanBox=document.querySelector('.lanBox');

        var ul=document.createElement('ul');
        
        var frag = document.createDocumentFragment();
        data.forEach(function(element) {
            var li=document.createElement('li');
            li.setAttribute('data-i',element.shortname);
            li.innerHTML=element.lang;
            frag.appendChild(li);
        }, this);
        ul.appendChild(frag);
       lanBox.appendChild(ul);

       return data;
    })
    .catch(e=>console.log('error',e));
}