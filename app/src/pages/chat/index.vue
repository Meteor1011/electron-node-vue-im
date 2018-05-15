<script>
    import Card from './card';
    import List from './list';
    import Message from './message';
    import Textinput from './textinput';
    import imgShow from './imgShow';
    import getimgsrc from '../../util/shotImg.js'
    import picDialog from './picDialog.vue'
    import {uploadPicByBase64} from '../../util/wrapsdk.js'
    import mainHeader from './mainHeader'
    import rightSide from './rightSide'
    
    // const {BrowserWindow} = require('electron').remote
    const {ipcRenderer} = require('electron');
    const path = require('path')
    export default {
        data(){
            return {
                showimg:false,
                src:'',
                PicDialog:false
            }
        },
        components: {
            Card,
            List,
            Textinput,
            Message,
            imgShow,
            picDialog,
            mainHeader,
            rightSide
        },
        methods:{
            showimgBox(msg){
                if(!msg){
                    this.src='';
                }
                this.showimg=msg;
            },
            showPicDialog(msg){
                if(!msg){
                    this.src='';
                }
                this.PicDialog=msg;
            },
            setImgSrc(Src, msg){
                if(Src){
                    this.src = Src;
                }
                if(msg){
                    this.showPicDialog(msg);
                }
            },
            newImgurl(){
                var imgsrc=getimgsrc(),_this=this;
                var selToID=this.$store.getters.getSelToID;
                uploadPicByBase64(imgsrc,selToID,function(){
                    _this.showimg=true;
                });
            },
            getUserSetting(user){
                let data = localStorage.getItem('userInfo');
                data = JSON.parse(data);
                let temp;
                if(data.constructor.name !== 'Array'){
                    throw new Error(`${key}的值的类型不是array.`);
                }
                for(let v of data){
                    if(v['name'] === user){
                        temp = v['screenshotHotKeys'] ? v['screenshotHotKeys'] : 'Ctrl+Alt+D';
                    } 
                }
                return temp;
            }
        },
        mounted:function(){
            ipcRenderer.send('msg','setWindowSize');
            window.Electron.ipc.on('screenshot',(event)=>{
                this.newImgurl();
                this.showimg=true;
            });
            // 启动截屏的热键启动功能
            let currentUserHotKey = this.getUserSetting(this.$store.getters.getSelfname);
            ipcRenderer.send('update-shortCut', currentUserHotKey, currentUserHotKey);
        }

    };
</script>

<template>
<div class="window">
    <div id="chat">
        <div class="sidebar">
            <card></card>
            <list></list>
        </div>
        <div class="main">
           <main-header></main-header>
           <div class = "main_box" id="main-box">
                <message @imageClick = "setImgSrc"></message>
                <textinput  @fromChildMsg = "showimgBox"></textinput>
           </div>
           <right-side></right-side>
        </div>
    </div>
    <imgShow v-show = "showimg" @imgClosed = "showimgBox">
    </imgShow>
    <picDialog v-show = "PicDialog" @picDialogClosed = "showPicDialog" :imgsrc = "src"></picDialog>
</div>
    
</template>

<style>
    .main_box{
        width: calc(100% - 200px);
        height: calc(100% - 50px);
        position: relative;
        display: inline-block;
        background-color: #fff;
    }
    .mask{
        width: 100%;
        height: 100%;
        opacity: 0.6;
        background: #000;
        position: absolute;
        top:0;
        left:0;
    }
    .setting{
        width:100%;
        height: 100%;
    }
    .window{
        width:100%;
        height:100%;
        position:relative;
        /*padding-top:20px;*/
    }
    #chat {
        margin: 0px auto;
        width:100%;
        height:100%;
        overflow: hidden;
        border-radius: 3px;
    } 
    #chat .main {
        height: 100%;
    }
    
    #chat .sidebar {
        float: left;
        width: 200px;
        height: 100%;
        color: #f4f4f4;
        background:url('../../../../dist/images/friend_bg.jpg') no-repeat;
        background-size: cover;
    }
    
    #chat .main {
        position: relative;
        overflow: hidden;
        background-color: #eee;
    }
    
    #chat .text {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
    }
    
    .main .message {
        height: calc(100% - 160px);
    }
</style>