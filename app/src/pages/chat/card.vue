<script>
    import {mapGetters, mapActions} from 'vuex'
    import getSystemLan from '../../util/getSystemLan'
    import {version, versionCode} from '../../../../package'
    import fetch from '../../util/fetch'
    import Tip from './tip'
    import {ipcRenderer, shell, remote, screen} from 'electron'

    export default {
        components: {Tip},
        data() {
            var data = {
                    user:this.$store.getters.getSelfname,
                    userimg:this.$store.getters.getSelfhead,
                    set_show:false,
                    lanList:false,
                    lan:this.$store.getters.getLan,
                    shotSet:false,
                    hotKeys:"Ctrl+Alt+D",
                    guide_ar_show:false, //阿拉伯语
                    guide_de_show:false, //德语
                    guide_en_show:false, //英语
                    guide_es_show:false, //西班牙语
                    guide_fr_show:false, //法语
                    guide_it_show:false, //意大利语
                    guide_ja_show:false, //日语
                    guide_ms_show:false, //马来语
                    guide_ru_show:false, //俄语
                    guide_th_show:false, //泰语
                    guide_vi_show:false, //越南语
                    guide_pt_show:false, //葡萄牙语
                    guide_show:false,    //中文简
                    guide_zh_show:false, //中文繁
                    guide_ko_show:false, //韩语
                    guide_in_show:false, //印尼语
                    textShow:false,
                    lanArr:[],
                    curLan:'',
                    localeL:'',
                    objArr:[]
                }
            return data;
        },
        created() {
            console.log('this.$i18n.locale=====',this.$i18n.locale);
            var isFirst = localStorage.getItem('isFirst');
            if(!isFirst){
                if(this.$i18n.locale == 'ar'){
                    this.guide_ar_show = true;
                }else if(this.$i18n.locale == 'de'){
                    this.guide_de_show = true;
                }else if(this.$i18n.locale == 'en-US'){
                    this.guide_en_show = true;
                }else if(this.$i18n.locale == 'es'){
                    this.guide_es_show = true;
                }else if(this.$i18n.locale == 'fr'){
                    this.guide_fr_show = true;
                }else if(this.$i18n.locale == 'it'){
                    this.guide_it_show = true;
                }else if(this.$i18n.locale == 'ja'){
                    this.guide_ja_show = true;
                }else if(this.$i18n.locale == 'ms'){
                    this.guide_ms_show = true;
                }else if(this.$i18n.locale == 'ru'){
                    this.guide_ru_show = true;
                }else if(this.$i18n.locale == 'th'){
                    this.guide_th_show = true;
                }else if(this.$i18n.locale == 'vi'){
                    this.guide_vi_show = true;
                }else if(this.$i18n.locale == 'pt'){
                    this.guide_pt_show = true;
                }else if(this.$i18n.locale == 'zh-CN'){
                    this.guide_show = true;
                }else if(this.$i18n.locale == 'zh-TW'){
                    this.guide_zh_show = true;
                }else if(this.$i18n.locale == 'ko'){
                    this.guide_ko_show = true;
                }else if(this.$i18n.locale == 'in'){
                    this.guide_in_show = true;
                }
                localStorage.setItem('isFirst','true');
            }
        },
        mounted() {
            getSystemLan().then(data => {
                this.lanArr = data;
                //console.log('this.$i18n.locale=====',this.$i18n.locale);
                for (var i = 0; i < this.lanArr.length; i++) {
                    if (this.$i18n.locale == this.lanArr[i].shortname) {
                        this.curLan = this.lanArr[i].lang;
                    }

                }
            })
            this.checkoutSend();//发送按钮快捷键设置
            this.sendHotSet();

            this.checkoutScreenShot();
            // this.$nextTick(function () {

            //     if(localStorage.getItem('userInfo')){
            //         this.hotKeys = localStorage.getItem('hotKeys');
            //     }
            // })
            //console.log('this.user=====',this.user);
            // 获取当前用户的截图热键设置
            this.getUserSetting(this.user);

        },
        methods: {
            ...mapActions([
                'get_remoteversion'
            ]),
            checkoutScreenShot() {
                var hot = localStorage.getItem(this.user + 'key');
                if (hot) {
                    this.shotKey = hot;
                }
            },
            checkoutSend() {
                var self = this;
                var data2 = JSON.parse(localStorage.getItem(this.user + 'send'));
                if (!data2) {
                    return;
                }
                self.$refs.cter.checked = data2.cter;
                self.$refs.Enter.checked = data2.Enter;
                self.$refs.Cter.checked = data2.Cter;
                self.$refs.enter.checked = data2.enter;
            },
            //打开设置
            open_set() {
                this.lanList = false;
                if (!this.set_show) {
                    this.set_show = true;
                    return;
                }
                this.set_show = false;
            },
            setClosed(e) {
                if (e.target.nodeName == 'IMG') {
                    this.open_set();
                    this.changeLanMenu();
                }
                this.textShow = false;
            },
            changeLanMenu() {
                if (!this.lanList) {
                    this.lanList = true;
                    this._getSystemLan();
                    return;
                }
                this.lanList = false;
            },
            sendHotSet() {
                var self = this;
                document.querySelector('.hotSet').addEventListener('click', function (e) {
                    if (e.target.nodeName == 'INPUT') {
                        if (self.$refs.cter.checked == true && self.$refs.Enter.checked == true) {
                            self.$refs.cter.checked = false;
                            self.$refs.Enter.checked = false;
                            self.$refs.Cter.checked = true;
                            self.$refs.enter.checked = true;
                        } else {
                            self.$refs.cter.checked = true;
                            self.$refs.Enter.checked = true;
                            self.$refs.Cter.checked = false;
                            self.$refs.enter.checked = false;
                        }
                        //发送快捷键
                        var item = {
                            'cter': self.$refs.cter.checked,
                            'Enter': self.$refs.Enter.checked,
                            'Cter': self.$refs.Cter.checked,
                            'enter': self.$refs.enter.checked
                        }
                        localStorage.removeItem(self.user + 'send');
                        localStorage.setItem(self.user + 'send', JSON.stringify(item));

                        var send;
                        if (self.$refs.cter.checked && self.$refs.Enter.checked) {
                            send = true;
                        } else {
                            send = false;
                        }
                        self.$store.dispatch('setSend', send);
                    }
                })
            },
            closeGuide() {
                this.guide_ar_show = false;
                this.guide_de_show = false;
                this.guide_en_show = false;
                this.guide_es_show = false;
                this.guide_fr_show = false;
                this.guide_it_show = false;
                this.guide_ja_show = false;
                this.guide_ms_show = false;
                this.guide_ru_show = false;
                this.guide_th_show = false;
                this.guide_vi_show = false;
                this.guide_pt_show = false;
                this.guide_show = false;
                this.guide_zh_show = false;
                this.guide_ko_show = false;
                this.guide_in_show = false;
            },
            guideShow() {
                if(this.$i18n.locale == 'zh-CN'){
                    this.guide_show = true;
                }else if(this.$i18n.locale == 'en-US'){
                    this.guide_en_show = true;
                }else if(this.$i18n.locale == 'zh-TW'){
                    this.guide_zh_show = true;
                }else if(this.$i18n.locale == 'ar'){
                    this.guide_ar_show = true;
                }else if(this.$i18n.locale == 'de'){
                    this.guide_de_show = true;
                }else if(this.$i18n.locale == 'es'){
                    this.guide_es_show = true;
                }else if(this.$i18n.locale == 'fr'){
                    this.guide_fr_show = true;
                }else if(this.$i18n.locale == 'it'){
                    this.guide_it_show = true;
                }else if(this.$i18n.locale == 'ja'){
                    this.guide_ja_show = true;
                }else if(this.$i18n.locale == 'ru'){
                    this.guide_ru_show = true;
                }else if(this.$i18n.locale == 'th'){
                    this.guide_th_show = true;
                }else if(this.$i18n.locale == 'vi'){
                    this.guide_vi_show = true;
                }else if(this.$i18n.locale == 'ms'){
                    this.guide_ms_show = true;
                }else if(this.$i18n.locale == 'pt'){
                    this.guide_pt_show = true;
                }else if(this.$i18n.locale == 'ko'){
                    this.guide_ko_show = true;
                }else if(this.$i18n.locale == 'in'){
                    this.guide_in_show = true;
                }

                //this.guide_show = true;
                this.set_show = false;
                this.textShow = false;
            },
            test(){
                this.textShow = true;
                var _this = this;
                let keyNum = 0;
                document.onkeydown = function (event) {
                    if(!_this.textShow) return false;
                    var e = event || window.event;
                    keyNum++;
                    let ctrl = e.ctrlKey ? 'Ctrl' : 'Ctrl';
                    let shift = e.altKey ? 'Alt' : 'Alt';
                    let other = '';
                    // ctrl+alt+第三个键的情况
                    if(e.ctrlKey && e.altKey){
                        // 按第三次以上包括第三次，判断是不是连续按了ctrl、alt
                        if(e.keyCode !== 17 && e.keyCode !== 18){
                            let temp = e.key.length == 1 ? e.key.toUpperCase() : e.key;
                            console.log(e.key,'33333',process.platform)
                            other = temp.replace(/\s/g, 'Space').replace(/Meta/g, process.platform !== 'darwin' ? 'Super' : 'Cmd');
                            _this.hotKeys = `${ctrl}+${shift}+${other}`;
                            let data = {
                                name: _this.user,
                                screenshotHotKeys: _this.hotKeys
                            }
                            _this.setUserSetting('userInfo', data);
                            _this.textShow = false;
                        }
                    }if(!e.ctrlKey && !e.altKey){ // 只按下一个除ctrl、alt键之外的键
                        let temp = e.key.length == 1 ? e.key.toUpperCase() : e.key;
                        other = temp.replace(/\s/g, 'Space').replace(/Meta/g, process.platform !== 'darwin' ? 'Super' : 'Cmd');
                        _this.hotKeys = `${ctrl}+${shift}+${other}`;
                        let data = {
                            name: _this.user,
                            screenshotHotKeys: _this.hotKeys
                        }
                        _this.setUserSetting('userInfo', data);
                        _this.textShow = false;
                    }
                }
            },
            setUserSetting(key, json){
                let data = localStorage.getItem(key);
                data = JSON.parse(data);
                let oldScreenshotHotKeys = '';
                if(data.constructor.name !== 'Array'){
                    throw new Error(`${key}的值的类型不是array.`);
                }
                data.forEach(v => {
                    if(v['name'] === json['name']){
                        oldScreenshotHotKeys = v['screenshotHotKeys'] ? v['screenshotHotKeys'] : 'Ctrl+Alt+D';
                        v['screenshotHotKeys'] = json.screenshotHotKeys;
                    }
                })
                localStorage.setItem(key, JSON.stringify(data));
                ipcRenderer.send('update-shortCut', oldScreenshotHotKeys, json.screenshotHotKeys);
            },
            getUserSetting(user){
                let data = localStorage.getItem('userInfo');
                data = JSON.parse(data);
                if(data.constructor.name !== 'Array'){
                    throw new Error(`${key}的值的类型不是array.`);
                }
                for(let v of data){
                    if(v['name'] === user){
                        this.hotKeys = v['screenshotHotKeys'] ? v['screenshotHotKeys'] : 'Ctrl+Alt+D';
                    } 
                }
            },
            setLanClosed(){
                this.lanList = false;
            },
            _getSystemLan() {
                getSystemLan().then(data => {
                    this.lanArr = data;
                    //this.lanArr.concat(data);
                })
            },
            selLan(lang, shortname) {
                console.log('lang====', lang, shortname);
                this.curLan = lang;
                this.lanList = false;
                this.$i18n.locale = shortname;
                var obj = {};
                obj.name = this.user;
                obj.language = shortname;
                for (var i = 0; i < this.objArr.length; i++) {
                    if (this.objArr[i].name == this.user) {
                        this.objArr.splice(i, 1);
                    }
                }
                this.objArr.push(obj);
                localStorage.setItem('userLan', JSON.stringify(this.objArr));
                this.$store.dispatch('setLan',shortname);
            },
            checkVersion() {
                let _this = this;
                this.get_remoteversion().then(res => {
                    if (this.$store.state.card.remoteVersion > +versionCode) {
                        this.$refs.version.init({
                            content: _this.$t("message.obj.isUpdate"),
                            btns: {
                                ok: {
                                    txt: _this.$t("message.obj.sure"),
                                    cb() {
                                        _this.download();
                                        return false;
                                    }
                                },
                                cancle: {
                                    txt: _this.$t("message.obj.off")
                                }
                            }
                        });
                    } else {
                        this.$refs.version.init({
                            content: _this.$t("message.obj.new_version"),
                            btns: {
                                cancle: {
                                    txt: _this.$t("message.obj.sure")
                                }
                            }
                        });
                    }
                })
                    .catch(err => {
                        alert('网络超时', err);
                    })
            },
            download() {
                shell.openExternal('http://chat.16lao.com/')
            }
        }
    };
</script>

<template>
    <div class="card">
        <header>
            <img class="avatar" width="40" height="40" :alt="user" :src="userimg">
            <p class="name" :title="user">{{user}}</p>

            <img src="images/setting.png" class="set_box" ref="openSet" v-on:click="open_set">

            <div class="guides" v-show="guide_show" @click="closeGuide">
                <img src="../../../../dist/images/guide.png"/>
            </div>
            <div class="guides" v-show="guide_zh_show" @click="closeGuide">
                <img src="../../../../dist/images/zh.png"/>
            </div>
            <div class="guides" v-show="guide_ar_show" @click="closeGuide">
                <img src="../../../../dist/images/ar.png"/>
            </div>
            <div class="guides" v-show="guide_de_show" @click="closeGuide">
                <img src="../../../../dist/images/de.png"/>
            </div>
            <div class="guides" v-show="guide_en_show" @click="closeGuide">
                <img src="../../../../dist/images/en.png"/>
            </div>
            <div class="guides" v-show="guide_es_show" @click="closeGuide">
                <img src="../../../../dist/images/es.png"/>
            </div>
            <div class="guides" v-show="guide_fr_show" @click="closeGuide">
                <img src="../../../../dist/images/fr.png"/>
            </div>
            <div class="guides" v-show="guide_it_show" @click="closeGuide">
                <img src="../../../../dist/images/it.png"/>
            </div>
            <div class="guides" v-show="guide_ja_show" @click="closeGuide">
                <img src="../../../../dist/images/ja.png"/>
            </div>
            <div class="guides" v-show="guide_ms_show" @click="closeGuide">
                <img src="../../../../dist/images/ms.png"/>
            </div>
            <div class="guides" v-show="guide_ru_show" @click="closeGuide">
                <img src="../../../../dist/images/ru.png"/>
            </div>
            <div class="guides" v-show="guide_th_show" @click="closeGuide">
                <img src="../../../../dist/images/th.png"/>
            </div>
            <div class="guides" v-show="guide_vi_show" @click="closeGuide">
                <img src="../../../../dist/images/vi.png"/>
            </div>
            <div class="guides" v-show="guide_ko_show" @click="closeGuide">
                <img src="../../../../dist/images/ko.png"/>
            </div>
            <div class="guides" v-show="guide_pt_show" @click="closeGuide">
                <img src="../../../../dist/images/pt.png"/>
            </div>
            <div class="guides" v-show="guide_in_show" @click="closeGuide">
                <img src="../../../../dist/images/in.png"/>
            </div>
            <div class="setting" v-show="set_show">
                <div class="set">
                    <div class="set_header">
                        <span class="title">{{$t("message.obj.set")}}</span>
                        <i class="set_closed" @click="setClosed">
                            <img src="images/set_close.png" alt="closed"/>
                        </i>
                    </div>
                    <div class="set_body">
                        <p>{{$t("message.obj.sys_lan")}}</p>
                        <p class="sysLan">
                            <span>{{curLan}}</span>
                            <a href="javascript:void(0)" v-on:click="changeLanMenu">{{$t("message.obj.change_lan")}}
                            </a>
                        <div class="lanSet" v-show="lanList">
                            <div class="set_lan_header">
                                <span class="title">{{$t("message.obj.sys_lan")}}</span>
                                <i class="set_lan_closed" @click="setLanClosed">
                                    <img src="images/set_close.png" alt="closed"/>
                                </i>
                            </div>
                            <div class="set_lan_list">
                                <ul>
                                    <li v-for="item in lanArr" @click="selLan(item.lang,item.shortname)">
                                        {{item.lang}}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        </p>

                        <p>{{$t("message.obj.hot_set")}}</p>
                        <p class="hot">
                            <ul class="hotSet">
                                <li>{{$t("message.obj.enter")}}<input ref="cter" type="radio" checked/>Ctrl+Enter
                                    <input ref="enter" type="radio">Enter
                                </li>
                                <li>{{$t("message.obj.send")}}<input ref="Cter" type="radio"/>Ctrl+Enter
                                    <input ref="Enter" type="radio" checked>Enter
                                </li>
                                <li style="margin-bottom: 0px">{{$t("message.obj.screenshot")}}<a @click="test" href="javascript:void(0)">{{hotKeys}}</a>
                                    <span v-show="textShow" style="color: #f30f1a">{{$t("message.obj.hotSet")}}</span></li>
                            </ul>
                        </p>

                        <p> {{$t("message.obj.version")}}</p>
                        <p class="verson sysLan">
                            <span>{{$t("message.obj.16chat")}}</span>
                            <a href="javascript:void(0)" @click="checkVersion" class="verson_btn"
                               style="margin-left: 25px">{{$t("message.obj.update")}}</a>
                        </p>
                        <p class="guide sysLan">{{$t("message.obj.new_guid")}}<a href="javascript:void(0)"
                                                                                 @click="guideShow">{{$t("message.obj.see")}}</a>
                        </p>
                    </div>
                </div>
            </div>
            <Tip ref="version"></Tip>
        </header>
    </div>
</template>

<style scoped>
    header {
        position: relative;
    }

    .test {
        width: 100px;
        height: 100px;
        border: 1px solid red;
        background: #fff;
    }

    .guides {
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        z-index: 10;
    }

    .guides img {
        width: inherit;
        height: inherit;
    }

    .setting {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
    }

    .set {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 480px;
        height: 315px;
        transform: translate(-50%, -50%);
        background: #fff;
        border-radius: 3px;
        box-shadow: 0 0 12px 2px rgba(0, 0, 0, .5);
    }

    .set_header {
        width: inherit;
        height: 30px;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        background-color: #2799ea;
        color: #fff;
        overflow: hidden;
    }

    .set_box {
        position: absolute;
        display: inline-block;
        width: 16px;
        height: 16px;
        left: 154px;
        top: 58px;
    }

    .title {
        display: inline-block;
        height: inherit;
        line-height: 30px;
        margin-left: 20px;
    }

    .set_closed {
        display: inline-block;
        width: 30px;
        height: 30px;
        float: right;
        line-height: 30px;
        text-align: center;
    }

    .set_body {
        color: #333;
    }

    .set_body a {
        color: #0066cc;
        margin-left: 20px;
    }

    .set_body p:first-child {
        margin-top: 17px;
    }

    .set_body p {
        margin-top: 10px;
        padding-left: 20px;
    }

    .set_body span {
        display: inline-block;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
    }

    .set_lans {
        width: 432px;
        height: 218px;
        position: absolute;
        left: 40px;
        top: 62px;
        text-align: center;
        padding: 5px;
        border: 1px solid #000;
        background: #fff;
    }

    .set_lans li {
        cursor: pointer;
        float: left;
        width: 33.3%;
        padding: 2px 4px;
    }

    .lansClosed {
        position: absolute;
        z-index: 30;
        right: 20px;
        bottom: 10px;
        display: inline-block;
        width: 80px;
        border-radius: 5px;
        height: 32px;
        border: 1px solid #888;
        text-align: center;
        line-height: 32px;
    }

    .hotSet {
        overflow: hidden;
    }

    .hotSet li {
        margin-bottom: 5px;
    }

    .hotSet li input {
        width: 13px;
        height: 13px;
        margin-right: 5px;
        margin-left: 20px;
    }

    .verson {
    }

    .verson_btn {
    }

    .guide {
    }

    .guide a {
        margin-left: 17px;
        text-decoration: underline;
    }

    .card {
        padding: 12px;
    }

    .card .avatar,
    .name {
        vertical-align: middle;
    }

    .card .avatar {
        border-radius: 2px;
    }

    .card .name {
        width: 116px;
        display: inline-block;
        margin: 0 0 0 15px;
        font-size: 16px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .lanSet {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 560px;
        height: 334px;
        transform: translate(-50%, -50%);
        background: #fff;
        border-radius: 3px;
        box-shadow: 0 0 12px 2px rgba(0, 0, 0, .5);
    }

    .set_lan_header {
        width: inherit;
        height: 30px;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        background-color: #2799ea;
        color: #fff;
        overflow: hidden;
    }

    .set_lan_closed {
        display: inline-block;
        width: 30px;
        height: 30px;
        float: right;
        line-height: 30px;
        text-align: center;
    }

    .set_lan_list > ul {
        overflow: hidden;
    }

    .set_lan_list > ul > li {
        float: left;
        width: 140px;
        margin-top: 15px;
        padding-left: 10px;
    }

    .set_lan_list > ul > li:hover {
        background-color: #2799ea;
        border-radius: 3px;
        cursor: pointer;
        color: #fff;
    }

</style>