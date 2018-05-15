const os = require('os');
const fs = require('fs');
const path = require('path');
const AppPath = 'AppData/Roaming/16Chat/User';
const zjlaoPath = 'AppData/Roaming/16Chat';

//console.log('getfriends')
//console.log(os.homedir());
export default function getFriend(username) {
    var friends = [];
    var userpath = path.join(os.homedir(), AppPath);
    //console.log(path.join(userpath,username));
    return new Promise((resolve, reject) => {
        fs.stat(userpath, (err, stats) => {
            if (stats === undefined) {
                resolve(friends)
            } else { //存在user文件夹
                fs.stat(path.join(userpath, username), (err, state) => {
                    if (stats === undefined) {
                        resolve(friends)
                    } else {
                        fs.readFile(path.join(userpath, username), (err, data) => {
                            if(data != null && data != undefined){
                                friends = data.toString()
                            }
                            resolve(friends)
                        })
                    }
                })
            }
        })
    })

}