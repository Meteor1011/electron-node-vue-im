export default function repLabel(str){
    //特换所有的标签
    //console.log(str)
   var msg= str.replace(/<div><br>/g,'<br>').replace(/<(div|p|h1|h2|h3|h4|h5|h6)[^>]*>/g,'<br/>').replace(/<\/(div|p|h1|h2|h3|h4|h5|h6)>/g,'')
    .replace(/<(?!br|n|r).*?[^>]*>/g,'');
    return msg;
}