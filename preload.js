'use strict'

const electron = require('electron')
const remote = electron.remote
const ipc = electron.ipcRenderer
const currentWindow = remote.getCurrentWindow()
const path = remote.require('path')
const os = remote.require('os')
const release = os.release()
const platform = os.platform()
const fs=require('fs')

let appInfo
try {
    appInfo = remote.require('./config.json')
} catch (err) {
    appInfo = null
}

window.Electron={
    Menu: remote.Menu,
    MenuItem: remote.MenuItem,
    currentWindow: currentWindow,
    // version: remote.process.versions['electron'],
    appInfo: appInfo,
    require: require,
    remote: remote,
    ipc: ipc,
    clipboard: electron.clipboard,
    fs:fs,
    shell:electron.shell
}

// if (platform === 'win32') {
//     window.Electron.notifier = remote.require('electron-notify')
//     window.Electron.notifier.setConfig({
//         appIcon: path.join(__dirname, 'icon.png'),
//         borderRadius: 0,
//         defaultStyleContainer: {
//             backgroundColor: '#f0f0f0',
//             padding: '10px',
//             border: '1px solid #CCC',
//             fontFamily: 'Arial',
//             fontSize: '12px',
//             position: 'fixed',
//             left: 0,
//             right: 0,
//             top: 0,
//             bottom: 0
//         },
//         defaultStyleImage: {
//             float: 'right',
//             width: '40px',
//             height: '40px',
//             marginLeft: '10px',
//             borderRadius: '100%'
//         },
//         defaultStyleClose: {
//             position: 'absolute',
//             top: 1,
//             right: 3,
//             fontSize: 11,
//             color: '#aaa'
//         }
//     })
// }

// delete global.require
// delete global.exports
// delete global.module