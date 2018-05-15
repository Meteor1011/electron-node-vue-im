 const {clipboard}=require('electron')
 function getImgUrl(){
    var imgurl=clipboard.readImage();
    return imgurl;
 }
 export default getImgUrl