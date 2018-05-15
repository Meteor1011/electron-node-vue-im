<script>
    import {getPrePageHistorymsg} from '../../util/wrapsdk.js';
    import {getTranslateMsg} from '../../util/getTranslateMsg';
    const {shell} = require('electron')
    var menu = new window.Electron.Menu();
   

    export default {
        data() {
            var data = {
                selToID:this.$store.getters.getSelToID,
                currentMsg:[]
            };
            return data;
        },
        methods:{
            getMoreHistorymsg(){
                this.$store.dispatch("set_msgtip",2);
                var selToID=this.$store.getters.getSelToID;
                getPrePageHistorymsg(selToID);
            },
            imgFilter(data){
                let transText = this.$store.getters.getMsgTransed(data.uniqueId)
                if(transText === undefined){
                    return '<span data-uid="'+ data.uniqueId+'">'+this.emojiFilter(data.content)+'</span>';
                }else{
                    return '<span data-uid="'+ data.uniqueId+'">'+this.emojiFilter(data.content)+
                    '<br>'+transText+
                    '</span>';
                }
            },
            emojiFilter(data){
                return data;
            },
            trans(){
                let transLan = this.$store.getters.getTransLan;
                let ele = window.getSelection().focusNode.parentElement;
                if(ele.dataset.uid === undefined){
                    ele = window.getSelection().focusNode;
                }
                let tran = {
                    text:window.getSelection().toString(),
                    from:'auto',
                    to:transLan,
                    uid:ele.dataset.uid
                    }
                getTranslateMsg(tran);
            },
            imageClick(){
                var self = this;
                document.querySelector('#msg_show')
                .addEventListener('click',function(e){
                    var obj = e.target;
                    if(obj.className == 'imgClick'){
                        let data = obj.getAttribute("bigimgurl");
                        self.$emit('imageClick', data,true);
                    }
                    if(obj.className == "custom_msg"){
                        var url = obj.dataset.goodsurl;
                        shell.openExternal(url);
                    }
                });
            }
        },
        directives: {
            // 发送消息后滚动到底部
            'scroll-bottom':{
               update:function(el){
                   setTimeout(function () {
                        el.scrollTop = el.scrollHeight - el.clientHeight
                    }, 300);
               }
            }
        },
         computed:{
            getselToIDMsg(){
                let msgTrigger = this.$store.getters.getMsgTrigger;
                let current = this.$store.getters.getMsg;
                this.currentMsg = current;
                return msgTrigger;
            },
            msgTip(){
                var msg = this.$store.getters.getMsgTip;
                if(msg=='正在获取历史消息...'){
                    msg = this.$t("message.obj.history");
                }else if(msg=='点击获取更多消息'){
                    msg = this.$t("message.obj.more_msg");
                }else if(msg=='没有更多历史消息'){
                    msg = this.$t("message.obj.IM_no_more");
                }else{
                    msg = this.$t("message.obj.no_friend");
                }
                return msg;
            }
        },
        mounted:function(){
            this.imageClick();
            let div_message=document.getElementById('msg_show');
            let span=document.getElementById('showmore_msg');
            let moreMsgBox=document.querySelector('.has');
            var self = this;
            span.innerHTML= self.selToID==''?this.$t("message.obj.no_friend"):self.msgTip;//self.$store.getters.GetStrings.translate('more_msg');
            moreMsgBox.style.display='inline-block';
            div_message.onscroll=function(e){
                var t = this.scrollTop;
                if( t ==0 ) { 
                    span.innerHTML= self.msgTip//self.$store.getters.GetStrings.translate('more_msg');
                    moreMsgBox.style.display='inline-block';
                } else {
                    moreMsgBox.style.display='none';
                }     
            }
            function selText(sel_target){
                let sss = window.getSelection();
                if(sss.isCollapsed){
                    var range = document.createRange(); 
                    range.selectNode(sel_target);  
                    window.getSelection().addRange(range);  
                }
                return true;
            }

            div_message.oncontextmenu=function(e){
                e.preventDefault();
                if(e.target.nodeName === 'SPAN'){
                   if(selText(e.target)) {
                       setTimeout(function(){menu.popup(window.Electron.remote.getCurrentWindow())},200);
                   }
                }
            }
            menu.append(new window.Electron.MenuItem({ label: '复制', click:function() { window.Electron.clipboard.writeText(window.getSelection().toString()); } }));
            menu.append(new window.Electron.MenuItem({ type: 'separator' }));
            menu.append(new window.Electron.MenuItem({ label: '翻译',click:self.trans}));

            
        }
    };
</script>

<template>
<div id="msg_show" class="message" v-scroll-bottom="messages">
<div class='style-hide'>{{getselToIDMsg}}</div>
    <ul >
        <li class="has" id="moreMsgBox"><em id="showmore_msg" @click="getMoreHistorymsg" >{{msgTip}}</em></li>
        <li v-for="item in currentMsg">
            <p class="time">
                <em>{{item.date}}</em>
            </p>
            <div class="msgmain" :class="{ self:item.self }">
                <img class="avatar" width="30" height="30" :src="item.headUrl" />
                <div id = "msgtext" class="msgtext" v-html='imgFilter(item)'>
                </div>
            </div>
        </li>
    </ul>
</div>
</template>

<style>
    .xf_fanyi{
        color:gray;
    }
    p{
        margin:0px;
        padding:0px;
    }
    .style-hide{
        display:none
    }
    .message {
        padding: 10px 15px;
        overflow-y: scroll;
    }
    
    .message li {
        margin-bottom: 15px;
    }
    
    .message .time {
        margin: 7px 0;
        text-align: center;
    }

    .message .class_msgimg{
        max-width:300px;
    }

    .message>span {
        display: inline-block;
        padding: 0 18px;
        font-size: 12px;
        color: #fff;
        border-radius: 2px;
        background-color: #dcdcdc;
    }
    
    .message .avatar {
        float: left;
        margin: 0 10px 0 0;
        border-radius: 3px;
    }
    
    .message .right_btn {
        position: absolute;
        top: -16px;
        right: -11px;
        font-weight: bold;
        z-index: 200;
    }
    
    .message .msgtext:hover .right_btn {
        cursor: pointer;
        text-align: right;
        display: inline-block;
    }
    
    .message .msgtext {
        display: inline-block;
        position: relative;
        padding:10px;
        max-width: calc(100% - 40px);
        min-height: 30px;
        line-height: 2.5;
        font-size: 12px;
        text-align: left;
        word-break: break-all;
        background-color: #fafafa;
        border-radius: 4px;
    }
    
    .message .msgtext:before {
        content: " ";
        position: absolute;
        top: 9px;
        right: 100%;
        border: 6px solid transparent;
        border-right-color: #fafafa;
    }
    
    .message .self {
        text-align: right;
    }
    
    .message .self .avatar {
        float: right;
        margin: 0 0 0 10px;
    }
    
    .message .self .right_btn {
        position: absolute;
        top: -16px;
        left: -11px;
        z-index: 200;
    }
    
    .message .self .msgtext:hover .right_btn {
        cursor: pointer;
        display: inline-block;
        text-align: left;
    }
    
    .message .self .msgtext {
        background-color: #b2e281;
    }
    
    .message .self .msgtext:before {
        right: inherit;
        left: 100%;
        border-right-color: transparent;
        border-left-color: #b2e281;
    }
    .xf_fileimg{
        display:block;
        max-width:300px;
    }
    .msgtext>span{
        display:inline-block;
        vertical-align: bottom;
        word-break: break-all;
        word-wrap: break-word;
        /* white-space: pre-wrap; */
        overflow:hidden;
    }
    .msgtext img{
        max-height:300px;
        vertical-align: bottom;
    }
    .has{
        width:100%;
        text-align:center;
        cursor:pointer;
        color:blue;
        display:none;
    }

    /* 产品链接样式 */
.custom{
	width:322px;
	height: 80px;
	position: relative;
    display: block;
    white-space: normal;
    word-wrap: normal;
}
.custom_pic{
	display: block;
	width:80px;
	height: 80px;
	position: absolute;
	top:0px;
	left:0px;
}
.custom_pic>img{
	width:80px;
	height: 80px;
	vertical-align: bottom;
}
.custom_desc{
	display: block;
	margin-left:90px;
	padding-top:10px;
}
.custom_desc>a{
	display: block;
	margin-bottom: 10px;
	text-decoration: none;
}
.custom_desc>em{
	color:red;
}
</style>