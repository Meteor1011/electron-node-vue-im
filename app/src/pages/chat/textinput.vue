<script>
    import { mapGetters } from 'vuex';
    import {sendMsg, Emotions, uploadPic, sendCustomMsg,getI18n} from '../../util/wrapsdk.js'
    import {getCustom} from '../../util/getCustom.js';

    import {remote, desktopCapturer, ipcRenderer} from 'electron'
    var url = require('url');
    var path = require('path');
    var BrowserWindow = remote.BrowserWindow,
        ipc = ipcRenderer;
    var globalShort = remote.globalShortcut;

    var clipboard = require('electron').clipboard
    var menu = new window.Electron.Menu();
    menu.append(new window.Electron.MenuItem({ label: '粘贴', click: function(){
        var pasttext = clipboard.readText();
        if(pasttext){
            clipboard.writeText(pasttext)
        }else{
            return;
        }
        var iframe=document.getElementById('editor');
        var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        iframe.focus();
        iframeDocument.execCommand('paste'); 
     }}));

    export default {
        data() {
            return {
                isShow:false,
                Emotions:null,
                send:this.$store.getters.getSend,//发送快捷键
                user:this.$store.getters.getSelfname,//自己的用户名
                talk:this.$store.getters.getNeedTalk,
                msg:"",
                makeSure:false,
                win: null
            };
        },
        computed:{
            ...mapGetters([
                'getSelToID'//当前好友的账户id
            ])
        },
        methods: {
            fromChildMsg(){
                this.$emit('fromChildMsg',true);
            },
            show(){//表情的显示和隐藏
                if(this.isShow){
                    this.isShow=false;
                }else{
                    this.isShow=true;
                }
            },
            getDom(e){//iframe编辑器插入图片
                let target=e.target;
                let iframe=document.getElementById('editor');
                let  content=iframe.contentDocument || iframe.contentWindow.document;

                if(target.nodeName=='IMG'){
                    this.isShow=false;
                    var value=target.src;
                    var alt=target.alt;
                    
                    var img='<img src="'+value+'" name="'+alt+'xfei" alt="'+alt+'">';
                    content.execCommand('insertHTML',false,img);
                    content.body.focus();
                }
            },
            onSendMsg(event){//发送消息
                var iframe=document.getElementById('editor'),
                content=iframe.contentDocument || iframe.contentWindow.document,
                msgtosend=content.body.innerHTML;//改变之前的消息
                content.body.innerHTML="";
                var selToID=this.$store.getters.getSelToID;
                msgtosend=msgtosend.replace(/<br>/ig,'\n').replace(/<div>/ig,'\n').replace(/<\/div>/ig,'');
                sendMsg(msgtosend,selToID);
            },
            onFileChange(e){
                var files = e.target.files || e.dataTransfer.files;
                var selToID=this.$store.getters.getSelToID;
                var _this=this;
                if (!files.length)return; 
                var ext=files[0].type;
                if ((/^(jpg|jpeg|JPG|JPEG|png|PNG|gif|GIF)$/.test(ext.split('/')[1]))) {
                    uploadPic(files[0],selToID,function(){
                        _this.fromChildMsg();
                        document.querySelector('#file').value="";
                    });
                }else{
                    alert('图片格式错误');
                    return false;
                } 
            },
            screenshot(){
                // this.$nextTick(function(){
                //     window.Electron.ipc.send('screenshot');
                // })
                var _this = this;
                if (!this.win) {
                    this.capturer().then(function(data) {
                        _this.win = _this.createChildWin('/index.html', { fullscreen: true, width: 900, height: 800, alwaysOnTop: true, skipTaskbar: false, autoHideMenuBar: true, show: false });
                        // _this.win.webContents.openDevTools()
                    });
                }
                return this.win;
            },
            /**
             * 截取屏幕资源到本地
             */
            capturer(){
                var w = screen.width,
                    h = screen.height;

                return new Promise(function(resolve, reject) {
                    desktopCapturer.getSources({ types: ['window', 'screen'], thumbnailSize: { width: w, height: h } }, (error, sources) => {
                        if (error) console.error(error);
                        // localStorage['image'] = sources[0].thumbnail.toDataURL();
                        remote.getGlobal('def').screenShot = sources[0].thumbnail.toDataURL();
                        resolve(sources[0].thumbnail.toDataURL())
                    })
                })
            },
            /**
             * 创建截屏窗口
             */
            createChildWin(_url, opts) {
                var config = {
                    width: 500,
                    height: 500,
                    frame: false
                }
                config = Object.assign(config, opts)
                var _win = new BrowserWindow(config);
                _win.loadURL(url.format({
                    pathname: path.join(remote.app.getAppPath(), './screenshot/', _url),
                    protocol: 'file',
                    slashes: true
                }))

                _win.on('closed', () => {
                    _win = null;
                })
                _win.webContents.on('did-finish-load', () => {
                    _win.show();
                    _win.focus();
                })
                return _win;
            },
            addEventListenerIpc(){
                let _this = this;
                // 快捷键触发截屏
                ipcRenderer.on('global-shortcut-capture', function() {
                    _this.capturer().then(function(data) {
                        _this.win = _this.createChildWin('/index.html', { fullscreen: true, width: 900, height: 800, alwaysOnTop: true, skipTaskbar: false, autoHideMenuBar: true, show: false});
                        // _this.win.webContents.openDevTools()
                    });
                })
                // 接受截图退出事件
                ipcRenderer.on('quit-cut', (message) => {
                    _this.win && _this.clearWindow(_this.win);
                    _this.win = null;
                });
            },
            clearWindow(_win){
                _win && _win.close()
            },
           
            hotSendMsg(iframeDocument){
                var self = this;
                iframeDocument.body.onkeypress =function(e){//快捷键发送消息
                    var data2 = JSON.parse(localStorage.getItem(self.user+'send'));
                    if(data2){
                        if(data2.cter && data2.Enter){
                            self.send = true;
                        }else{
                            self.send = false;
                        }
                    }
                    if(!e.shiftKey){
                        if(self.send){
                            if(e.keyCode==13){
                                self.onSendMsg();
                                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
                            }else if(e.ctrlKey&&e.keyCode==10){
                                iframeDocument.execCommand('InsertParagraph'); 
                            }
                        }else{
                            if(e.ctrlKey&&e.keyCode==10){
                                self.onSendMsg(); 
                            }
                        }  
                    }
                }

                iframeDocument.body.onkeydown=function(e){//快捷键发送消息
                    setTimeout(function(){if(e.ctrlKey&&e.keyCode==86){
                        var pasttext = clipboard.readText();
                        if(pasttext){
                            clipboard.writeText(pasttext)
                        }
                    }},0);
                }
                iframeDocument.body.addEventListener('paste',function(e){
                   var pastedText;
                   if (window.clipboardData && window.clipboardData.getData) { // IE
                        pastedText = window.clipboardData.getData('Text');
                    } else {
                        pastedText = e.clipboardData.getData('Text');//e.clipboardData.getData('text/plain');
                    }
                    return pastedText;
                    function TransferString(content){    
                        var string = content;    
                        try{    
                            string=string.replace(/\r\n/g,"<br>")    
                            string=string.replace(/\n/g,"<br>");    
                        }catch(e) {    
                            alert(e.message);    
                        }    
                        return string;    
                    }    
                }) 
                iframeDocument.body.oncontextmenu = function(){
                    menu.popup(window.Electron.remote.getCurrentWindow())
                }
                iframeDocument.body.addEventListener('keyup',function(e){
                    var keystring = "";//记录按键的字符串
                    var hotkey = localStorage.getItem('hotKeys');
                    showKeyName(e);
                    // 判断 允许的快捷键
                    function showKeyName(e) {
                        var keyName;

                        var keyValue=[];
                            if(e.ctrlKey) keyValue.push("Ctrl");
                            if(e.altKey) keyValue.push("Alt");
                            if(e.shiftKey) keyValue.push("Shift");
                            var keyCodeMap={"48":"0","49":"1","50":"2","51":"3","52":"4","53":"5","54":"6","55":"7","56":"8","57":"9","65":"A","66":"B","67":"C","68":"D","69":"E","70":"F","71":"G","72":"H","73":"I","74":"J","75":"K","76":"L","77":"M","78":"N","79":"O","80":"P","81":"Q","82":"R","83":"S","84":"T","85":"U","86":"V","87":"W","88":"X","89":"Y","90":"Z"};
                            if(keyCodeMap[e.keyCode]){
                            keyValue.push(keyCodeMap[e.keyCode]);
                            }else{
                                return "无";
                            }
                            keyName = keyValue.join("+");
                            if(e.keyCode >15 && e.keyCode<19){
                                return "无";
                            }
                            if(!hotkey){
                                if(keyName == "Ctrl+Alt+A"){
                                    self.screenshot();
                                    return;
                                }
                            }
                            if(keyName == hotkey){
                                self.screenshot();
                            }

                    }
                },false)
            },
            //自定义消息
            _getCustom(){
                //58823251,6336440860
                let needTalk = this.$store.getters.getNeedTalk;
                let lan = this.$store.getters.getTransLan;
                let productId =this.$store.getters.getProductId;

                var self = this;
                if(!productId && !lan){
                    return;
                }
                getCustom(lan, productId).then(res=>{
                    if(res.data.code == "000000"){
                        self.msg = res.data.ret;
                        self.makeSure = true;
                    }else{
                        self.makeSure = false;
                    }
                }).catch(e=>{
                    console.log(e)
                });
            },
            isSure(m){
                if(m){
                    //this.makeSure = true;
                    var selToID= this.$store.getters.getSelToID;
                    let msg = JSON.stringify(this.msg);
                    sendCustomMsg(msg, selToID);
                }
                this.makeSure = false;
                this.msg = "";
            }
        },
        mounted(){
            getI18n(this);
            this. _getCustom();//自定义消息
            this.Emotions=Emotions();
            var iframe=document.getElementById('editor');
            var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                iframeDocument.designMode = "on";
                iframeDocument.open();
                iframeDocument.close();
                iframe.focus();
                var self=this;
                self.hotSendMsg(iframeDocument);//快捷键发送消息
            // 添加监听主程序的截图事件
            this.addEventListenerIpc();
            var _this = this;
            document.getElementById('app').addEventListener('click', function () {
                if (_this.isShow) {
                    _this.isShow = false;
                }
            })
            document.getElementById('editor').contentWindow.document.addEventListener('click', function () {
                if (_this.isShow) {
                    _this.isShow = false;
                }
            })
        }
    };
</script>

<template>
<div class="text" id="meditor">
    <div class="xf_config">
        <ul>
            <li >
                <img v-on:click.stop='show' src="images/face2.png" alt="emoji">
                <div class="xf_face" v-show="isShow">
                    <a v-for="(item,index) in Emotions">
                        <img width='20'  v-on:click="getDom" height='20' :src="item[1]" :alt="item[0]">
                    </a>
                </div>
            </li>
            <li><label for="file"><input style="display:none" @change="onFileChange" id="file" type="file"><img src="images/file2.png"  alt="image"></label></li>
            <li><img class="screenShot" v-on:click="screenshot" src="images/cut2.png" alt="snap"><input style="display:none;" tyle="file" id="cutFile"></li>
        </ul>
        <div class = "product" v-show = "makeSure" >
            <div class = "product_body">
                <span class= "customs" style = " white-space: normal;">
                    <a class = "custom_pics" href="javascript: void(0);" >
                        <img :data-goodsUrl = "msg.goodsUrl" class = "custom_msg" :src="msg.imgUrl" :title = "msg.title">
                    </a>
                    <span class = "custom_descs">
                        <a class = "custom_msg" href="javascript: void(0);" :data-goodsUrl="msg.goodsUrl" >{{msg.title}}</a>
                        <em>{{msg.currencyRemark}} {{msg.price}} /{{msg.unitName}}</em>
                    </span>
                </span>
                <div class = "isMakeSure">
                    <span v-on:click = "isSure(true)" class = "btn">确认</span>
                    <span v-on:click = "isSure(false)" class = "btn">取消</span>
                </div>
            </div>
        </div>
    </div>
    <iframe  id="editor" style="border:none;width:100%;height:96px;word-wrap:break-word;overflow-x:hidden;word-break: break-all;word-wrap:break-word;white-space: pre-wrap;"><html><head></head><body  style="min-height:100px;" bgcolor="#FFFFFF"></body></html></iframe>
    <span class="xf_send" :title="发送"  v-on:click="onSendMsg">{{$t("message.obj.send")}}</span>
</div>
</template>

<style>
    @import url('../../style/textinput.css');
</style>