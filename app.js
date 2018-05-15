'use strict'

//Electron.require('electron-cookies')
//delete Electron.require


function setInfo(){
    const  addon = require('getDefaultLan/getDefaultLan.js');
    const Strings = require('./localstring.js');
    var loc = addon.getDefaultLan();
    var strings = new Strings(loc);
     var ele = document.querySelector('#load-fail span')
        if(ele){
            ele.innerHTML=strings.translate("netError")+' ';
            ele.nextSibling.innerHTML=strings.translate('retry');
        }
}
function setStatus(status) {
    var loadFail = document.querySelector('#load-fail')

    switch (status) {
        case 0:
            loadFail.className = 'hide'
            break
        case -1:
            setInfo();
            loadFail.className = ''
            break
    }
}

function setVersion() {
    document.querySelector('#version').innerText = `www.1818lao.com`
}

function startApp() {
    if (!navigator.onLine) {
        setStatus(-1)
        return
    }

    setStatus(0)

    var appUrl = Electron.appInfo.urls.appUrl+ '?r=' + Math.random()

    fetch(appUrl)
        .then(function(resp) {
            setStatus(-1)

            if (!resp.ok) {
                let extra = {}
                Object.keys(resp).forEach(key => ['url', 'status', 'statusText', 'headers', 'bodyUsed', 'size', 'ok', 'timeout', 'json', 'text'].includes(key) && (extra[key] = resp[key]))
            }

            window.location = appUrl
        })
        .catch(function(err) {
            setStatus(-1)
        })
}

function bootstrap() {
    setVersion()
    document.querySelector('#retry').onclick = startApp
}

bootstrap()
startApp()

if (!navigator.onLine) {
    window.addEventListener('online', startApp)
}