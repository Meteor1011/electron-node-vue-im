// Basic init
//if (require('electron-squirrel-startup')) return;
const electron = require('electron')
const { app, BrowserWindow ,ipcMain,clipboard,Tray,Menu,nativeImage,shell} = electron;
const autoUpdater = electron.autoUpdater
var path = require('path')
const  lan=require('getDefaultLan');
const screenShot = require('screenshot')
const fs = require('fs')
const Strings = require('./localstring.js')

// 引入主进程的截图事件监听
const screenShot_main = require('./screenshot/screenShot_main');
var handleStartupEvent = function () {
    if (process.platform !== 'win32') {
      return false;
    }
    var squirrelCommand = process.argv[1];
   
    switch (squirrelCommand) {
      case '--squirrel-firstrun':
      case '--squirrel-install':
        install();
        return true;
      case '--squirrel-updated':
        updateinstall();
        return true;
      case '--squirrel-uninstall':
        uninstall();
        app.quit();
        return true;
      case '--squirrel-obsolete':
        app.quit();
        return true;
      default:
        return false;
    }
    function unreginstall(){
        var regedit = require('regedit')
        regedit.deleteKey('HKCR\\onesixliao',(err)=>{
            if(err){
                console.log(err);
            }
        })
    }

    function reginstall(){
        var exepath = process.execPath;
        var regedit = require('regedit')
        regedit.createKey(['HKCR\\onesixliao', 
        'HKCR\\onesixliao\\DefaultIcon',
        'HKCR\\onesixliao\\shell',
        'HKCR\\onesixliao\\shell\\open',
        'HKCR\\onesixliao\\shell\\open\\command'
    ], function(err) {
        //console.log('reginstall err = ',err);
        //})
        if(err == undefined){
            regedit.putValue({
                'HKCR\\onesixliao':{
                    'URL Protocol':{
                        value:exepath,
                        type:'REG_SZ'
                    },
                    '@':{
                        value:'onesixlaoProtocol',
                        type:'REG_DEFAULT'
                    }
                },
                'HKCR\\onesixliao\\DefaultIcon':{
                    '@':{
                        value:exepath+',1',
                        type:'REG_DEFAULT'
                    }
                },
                'HKCR\\onesixliao\\shell\\open\\command':{
                    '@':{
                        value:'\"'+exepath+'\" \"%1\"',
                        type:'REG_DEFAULT'
                    }
                }
            },function(err){
                
                //console.log(err)
                app.quit();
            });

        }
        else{
            app.quit();
            //console.log(err);
            
        }    
    });
}
    // console.log('reginstall');
    // reginstall();
    // console.log('reginstall done')
      // 安装
    function install() {
      var cp = require('child_process');    
      var updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe');
      var target = path.basename(process.execPath);
      var child = cp.spawn(updateDotExe, ["--createShortcut", target], { detached: true });
      //console.log('install ...');
      child.on('close', function(code) {
          //console.log('close ...');
          reginstall();
          //app.quit();
      });
    }
    //更新安装
    function updateinstall() {
      var cp = require('child_process');    
      var updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe');
      var target = path.basename(process.execPath);
      var child = cp.spawn(updateDotExe, ["--createShortcut", target], { detached: true });
      child.on('close', function(code) {
          reginstall();
          //app.quit();
      });
    }
    // 卸载
    function uninstall() {
      unreginstall();
      var cp = require('child_process');    
      var updateDotExe = path.resolve(path.dirname(process.execPath), '..', 'update.exe');
      var target = path.basename(process.execPath);
      var child = cp.spawn(updateDotExe, ["--removeShortcut", target], { detached: true });
      child.on('close', function(code) {
          app.quit();
      });
    }
  };
  if (handleStartupEvent()) {
    //return ;
  }

function updateHandle(){
  ipc.on('check-for-update', function(event, arg) {
    let appName='16Chat';
    let appIcon=__dirname + '/assets/icon.ico';
    let message={
      error:'检查更新出错',
      checking:'正在检查更新……',
      updateAva:'下载更新成功',
      updateNotAva:'现在使用的就是最新版本，不用更新',
      downloaded:'最新版本已下载，将在重启程序后更新'
    };
    const os = require('os');
    const {dialog} = require('electron');
    var updateFeed = 'http://192.168.6.203/squirrel';
    autoUpdater.setFeedURL(updateFeed + '?v=' + appVersion);
    //autoUpdater.setFeedURL('放最新版本文件的文件夹的服务器地址');
    autoUpdater.on('error', function(error){
      return dialog.showMessageBox(mainWindow, {
          type: 'info',
          icon: appIcon,
          buttons: ['OK'],
          title: appName,
          message: message.error,
          detail: '\r'+error
      });
    })
    .on('checking-for-update', function(e) {
        return dialog.showMessageBox(mainWindow, {
          type: 'info',
          icon: appIcon,
          buttons: ['OK'],
          title: appName,
          message: message.checking
      });
    })
    .on('update-available', function(e) {
        var downloadConfirmation = dialog.showMessageBox(mainWindow, {
            type: 'info',
            icon: appIcon,
            buttons: ['OK'],
            title: appName,
            message: message.updateAva
        });
        if (downloadConfirmation === 0) {
            return;
        }
    })
    .on('update-not-available', function(e) {
        return dialog.showMessageBox(mainWindow, {
            type: 'info',
            icon: appIcon,
            buttons: ['OK'],
            title: appName,
            message: message.updateNotAva
        });
    })
    .on('update-downloaded',  function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        var index = dialog.showMessageBox(mainWindow, {
            type: 'info',
            icon: appIcon,
            buttons: ['restart now','restart later'],
            title: appName,
            message: message.downloaded,
            detail: releaseName + "\n\n" + releaseNotes
        });
        if (index === 1) return;
        autoUpdater.quitAndInstall();
    });
    autoUpdater.checkForUpdates();
 });
}


global.def={
    Lan:lan.getDefaultLan(),
   // strings:new Strings(lan.getDefaultLan())
    screenShot: '', // 渲染页面的截图保存
} 
// Let electron reloads by itself when webpack watches changes in ./app/
//srequire('electron-reload')(__dirname)

// To avoid being garbage collected
let mainWindow,tray,needtalk,needquit=false,shouldClose = false,
emptyIcon = nativeImage.createFromPath(path.join(__dirname,'empty.png')),
normalIcon = nativeImage.createFromPath(path.join(__dirname,'icon.png')),
offlineIcon = nativeImage.createFromPath(path.join(__dirname,'offline.png')),
infosIcon = nativeImage.createFromPath(path.join(__dirname,'infos.png')),
flashTrayTimer = null,title="",info="",isLogin = false,
menu_online = nativeImage.createFromPath(path.join(__dirname,'menu_online.png'))
menu_offline = nativeImage.createFromPath(path.join(__dirname,'menu_offline.png'));

function loadHome() {
    if (!mainWindow) return
    mainWindow.loadURL("file://" + path.join(__dirname, 'index1.html'))
    mainWindow.webContents.openDevTools({ detach: true });
}

var shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      if ( !mainWindow.isVisible()) mainWindow.show() 
      
      mainWindow.focus()
    }
  })
  
  if (shouldQuit) {
    needquit = true;
    app.quit()
  }

app.on('ready', () => {
    var talkto = process.argv[1] || '';
    var arr = talkto.match(/\d+/g);
    needtalk = arr ==null? '':arr.join();
//mainWindow.webContents.send('NEEDTALK',needtalk)
    let option = {
        width: 380,
        height: 600,
        useContentSize: true,
        frame:false, //无边框窗口
        maximizable:false,
        // movable:false,
        /*focusable:true,*/
        title: '16Chat',
        webPreferences: {  //网页功能设置
            preload: path.join(__dirname, 'preload.js'),
            //表示是否允许一个使用 https的界面来展示由 http URLs 传过来的资源
            allowDisplayingInsecureContent: true
        }
    };

    mainWindow = new BrowserWindow(option)

    //screenShot(mainWindow.webContents)
    //screenShot(mainWindow.webContents);
    //设置菜单栏不可见
    mainWindow.setMenuBarVisibility(false);
    tray = new Tray(offlineIcon)
    function showWnd(){
      mainWindow.show();
    }
    function quitapp(){
      //mainWindow.webContents.send('disconnect')
      needquit = true;
      app.quit();
    }
    function online(){
        mainWindow.webContents.send('online')
    }
    function offline(){
        mainWindow.webContents.send('offline')
    }
    const contextMenu = Menu.buildFromTemplate([
    //   {label:'上线',icon:menu_online,click:online},
    //   {label:'离线',icon:menu_offline,click:offline},
    //   {type: 'separator'},
      {label: '打开主面板',click:showWnd},
      {label: '退出',click:quitapp}
    ])
    tray.setToolTip('16Chat')
    tray.setContextMenu(contextMenu)
    //tray.setToolTip('hwlwlo')
    function display(){
        tray.displayBalloon({
            icon:path.join(__dirname,'icon.png'),
            title:title,
            content:info
        })

    }

    function flashTray(flash) {
        let hasIcon = false;
        if (flash) {
            if (flashTrayTimer) {
                return;
            }
            flashTrayTimer = setInterval(() => {
                if(hasIcon){
                    tray.setImage(infosIcon);
                }
                else{
                    tray.setImage(emptyIcon);
                }
                hasIcon = !hasIcon;
            }, 1000);
        } else {
            if (flashTrayTimer) {
                clearInterval(flashTrayTimer);
                flashTrayTimer = null;
            }
            if(isLogin){
                tray.setImage(normalIcon)
            }
            else{
                tray.setImage(offlineIcon)
            }
        }
    }

    loadHome();

    //BrowserWindow.webContents.openDevTools({ detach: true });

    ipcMain.on('screenshot',(event)=>{
        //screenshot();
    });
    ipcMain.on('off-line',(event,arg)=>{ //下线提示
        //图标变灰
        console.log(arg)
        tray.setImage(offlineIcon)
        tray.setToolTip('16Chat')
        title=arg.title;
        info=arg.info;
        if(isLogin){
            isLogin = false;
            display();//提示下线
        }
        
    })
    ipcMain.on('on-line',(event,arg)=>{ //上线提示
        //图标变正常
        isLogin = true;
        tray.setImage(normalIcon)
        tray.setToolTip(arg)
    })
    ipcMain.on('has-info',(event)=>{ //来消息提示
        if(!mainWindow.isVisible()){
            flashTray(true)
        }

    })
    ipcMain.on('talkto',(event)=>{
        event.returnValue = needtalk == -1? '': needtalk;
    });

    ipcMain.on('now-quit',(event)=>{
        app.quit();
    })



    mainWindow.on('close',event=>{

      if(!needquit){
        event.preventDefault();
        mainWindow.hide();
      }
      
    })

    tray.on('click', () => {
      mainWindow.show();
      flashTray(false)
    })

    mainWindow.on('show', () => {
      tray.setHighlightMode('always')
    })
    mainWindow.on('hide', () => {
      tray.setHighlightMode('never')
    })

    mainWindow.on('resize',() => {

        if(mainWindow.isMaximized()){
            console.log('是否最大化1',mainWindow.isMaximized());
            //窗体最大化时向渲染进程发消息
            mainWindow.webContents.send('reply','max');
        }else{
            mainWindow.webContents.send('reply','min');
        }
        //console.log('是否最大化',mainWindow.isMaximized());
    })
    var localLang = app.getLocale();
    console.log('本地语言是：：：：：',localLang);
    mainWindow.webContents.on('did-finish-load',()=>{
        mainWindow.webContents.send('localLang',localLang)
    })
//接受渲染进程传来的消息
    ipcMain.on('msg',(event,arg)=>{
        //向渲染进程发消息
        //event.sender.send('localLang',localLang);
        //接收渲染进程传过来的消息
        if(arg=='setWindowSize'){
            mainWindow.setSize(922,600);
            mainWindow.setMaximizable(true);
            //console.log(app.getPath('userData'));
        }else if(arg=='close'){ //窗体关闭
            app.exit();
        }else if(arg=='setMin'){  //窗体最小化
            mainWindow.minimize();
        }else if(arg=='setMax'){  //窗体最大化
            mainWindow.maximize();
        }else if(arg=='setRestore'){
            mainWindow.unmaximize();
        }else if(arg=='createChildWin'){
            console.log('===createChildWin===');
            //createChildWin('./capturer.html');
        }

    })

    // 监听新窗口打开
    mainWindow.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });

    // 添加截图的主进程事件监听
    screenShot_main(mainWindow.webContents);
})

app.on('window-all-closed',()=>{
    needquit = true;
    mainWindow.webContents.send('quit_im');
})


