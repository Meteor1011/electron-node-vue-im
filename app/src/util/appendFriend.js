
/*
filename:appendFriend.js
function:新增好友，写入到好友列表文件中
author:fshang
date:2017-08-14
last:2017-08-14
*/

const os = require('os');
const fs = require('fs');
const path = require('path');
const AppPath = 'AppData/Roaming/16Chat/User';
//将新增好友写入到文件中
export default function appendFriend(username,friendId) {
    //console.log(username,friendId);
    if(username == null || username == undefined || username == '') return;
    if(friendId == null || friendId == undefined || friendId == '') return;
    var userpath = path.join(os.homedir(), AppPath);//文件存放路径
    var  friend = friendId+',';//每个后面加一个逗号，读取和下次添加
    var ncount = 1;
    function writeHander(){
        fs.appendFile(path.join(userpath,username),friend,(err)=>{
            if(err){
                console.log("appendFriend failed");
                console.log(err);
            }
            else{
                console.log('appendFriend success')
            }
        })
    };
    //递归创建文件夹
    function mkdirs( filepath,callback){
        fs.stat(filepath,(err,stats)=>{
            if(stats === undefined){
                mkdirs(path.dirname(filepath),()=>{
                    fs.mkdir(filepath,callback)
                })
            }
            else{
                callback();
            }
        });
    };
    //写入文件
    mkdirs(userpath,writeHander)
    
    

}