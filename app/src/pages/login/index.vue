<script>
    import getThum from '../../util/getThum.js'
    import {login, getAllFriend,getI18n} from '../../util/wrapsdk.js'
    import {getUser} from '../../util/getUser.js';
    const electron = require('electron');
    const ipc = electron.ipcRenderer;
    const shell = electron.shell;
    const path = require('path');
    import {mapActions} from 'vuex'
    import Tip from '../chat/tip'
    import {versionCode} from '../../../../package'

    export default {
        components: {
            Tip
        },
        data: function () {
            var data = {
                originOptions: [],//原始数据
                displayOptions: [], //经过筛选后的数据
                isShow: false,
                username: "",
                userpassword: "",
                selected: "",
                errorShow: true, //是否显示错误信息
                errorInfo: '', //错误提示
                isRemeber: false,   //是否记住密码
                userArr: [],
                dialogShow: false,
                delAccount: '',
                headUrl: ''
            }
            return data;
        },
        mounted: function () {
            getI18n(this);
           
           this.checkVersion();

            //将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。
            this.$nextTick(function () {
                document.getElementById('main').addEventListener('click', this.blur);
                //console.log(JSON.parse(localStorage.getItem('userInfo')));
                var userInfo = JSON.parse(localStorage.getItem('userInfo'));

                //console.log(typeof userInfo);
                if (userInfo && userInfo.length > 0) {
                    this.userArr = userInfo;
                    this.username = this.userArr[this.userArr.length - 1].name;
                    if(this.userArr[this.userArr.length - 1].isRem){
                        this.userpassword = this.userArr[this.userArr.length - 1].pwd;
                        this.isRemeber = true;
                    }else{
                        this.userpassword = '';
                    }
                    this.userArr.forEach(function (item) {
                        //console.log(item.pwd);
                    });
                }

                var userLan = JSON.parse(localStorage.getItem('userLan'));
                ipc.on('localLang', (event, arg) => {
                    //console.log('主进程传过来的语言', arg);
                    //var _this = this;
                    if (userLan && userLan.length > 0) {
                        this.$i18n.locale = userLan[userLan.length - 1].language;
                    }else{
                        this.$i18n.locale = arg;
                    }
                })
            });

        },
        methods: {
            ...mapActions([
                'get_remoteversion'
            ]),
            page_min: function () {
                console.log('min');
                ipc.send('msg', 'setMin')
            },
            page_close: function () {
                console.log('close');
                ipc.send('msg', 'close');
            },
            //是否记住密码
            remeber_pwd: function () {
                this.isRemeber = !this.isRemeber;
                for (var i = 0; i < this.userArr.length; i++) {
                    if (this.userArr[i].name == this.username && this.userArr[i].isRem) {
                        this.userpassword = this.userArr[i].pwd;
                    }
                }
                //console.log('isRemeber', this.isRemeber, this.username);
            },
            usernameFocus: function () {
                if (!this.isShow) {
                    //document.body.click();
                    this.isShow = true;
                } else {
                    this.blur();
                }
                console.log('this.isShow++++', this.isShow);
            },
            nameSelect: function (str) {
                var _this = this;
                _this.username = str.name;
                _this.userpassword = str.pwd;
                _this.isRemeber = str.isRem;
                console.log('str====', str);
                this.blur();
            },
            //删除账号
            del: function (account) {
                var _this = this;
                _this.dialogShow = true;
                console.log('delete  username', account);
                _this.delAccount = account;
            },
            sureDel: function () {
                var _this = this;
                for (var i = 0; i < _this.userArr.length; i++) {
                    console.log(_this.userArr[i].name);
                    if (_this.userArr[i].name == _this.delAccount) {
                        //console.log(i);
                        if (_this.username == _this.Account) {
                            _this.username = _this.userArr[0].name;
                        }
                        _this.userArr.splice(i, 1);
                        localStorage.setItem('userInfo', JSON.stringify(_this.userArr))
                    }

                }
                if (_this.userArr.length < 1) {
                    _this.username = '';
                    _this.userpassword = '';
                }
                _this.dialogShow = false;
            },
            cancelDel: function () {
                this.dialogShow = false;
            },

            Searchname: function () { //根据已经输入的字母搜索名字
                var _this = this;
                var search = _this.username;
                //console.log('now seach',search)
                if (search == '') {
                    //_this.blur();
                    _this.displayOptions = _this.originOptions
                    return;
                }
                _this.show = true;
                var REG_RULE = new RegExp(search, "i"); //根据用户输入做正则
                var originOptions = _this.originOptions;
                //将展示列表置空，然后用正则去原始列表中匹配
                _this.displayOptions = [];
                for (var i = 0; i < originOptions.length; i++) {
                    var item = originOptions[i];
                    if (REG_RULE.test(item)) {
                        _this.displayOptions.push(item);
                    }
                }
            },
            blur: function () { //展示列表隐藏
                this.isShow = false;
                console.log('this.isShow===', this.isShow);
            },
            cli: function (arg) {
                if (arg == 'forget') { //忘记密码
                    shell.openExternal('http://detail.1818lao.com/leading/memberAction!toFindPwdPage.aspx?language=zh_CN')
                } else if (arg == 'register') {  //注册
                    shell.openExternal('http://detail.1818lao.com/leading/memberAction.aspx?method=toPhoneRegisterPage&language=zh_CN&countryCd=110')
                }
            },
            loginClick: function () {
                var _this = this;
                _this.errorInfo = "";
                if (_this.username == '') {
                    _this.errorInfo = _this.$t("message.obj.username");
                } else if (_this.userpassword == '') {
                    _this.errorInfo = _this.$t("message.obj.pwd");
                } else {
                    getUser(_this.username, _this.userpassword).then(res => {
                        let data = res.data;
                        console.log('data', data);
                        if (data.ret == -1) {
                            _this.errorInfo = _this.$t("message.obj.pwd_err");
                        } else if (data.ret == -2) {
                            _this.errorInfo = _this.$t("message.obj.username_err");
                        } else {
                            login(data.ret,
                                function (respdata) {
                                    _this.$store.dispatch('check_needtalk');
                                    _this.$store.dispatch('check_need');
                                    ``
                                    getAllFriend()
                                    let newObj = {};
                                    _this.$set(newObj, 'name', _this.username);
                                    _this.$set(newObj, 'pwd', _this.userpassword);
                                    _this.$set(newObj, 'headUrl', data.ret.headImage);
                                    _this.$set(newObj, 'isRem', _this.isRemeber);

                                    // 保存被删除的用户信息
                                    let temp = null;
                                    for (var i = 0; i < _this.userArr.length; i++) {
                                        var name = _this.userArr[i].name;
                                        if (name == _this.username) {
                                            temp = _this.userArr.splice(i, 1)[0];
                                            temp.isRem = _this.isRemeber;
                                            console.log('temp=====',temp);
                                        }
                                    }
                                    // 更新不重建
                                    newObj = Object.assign({}, newObj, temp);

                                    //最多保存10个账号
                                    if (_this.userArr.length <= 9) {
                                        _this.userArr.push(newObj);
                                    } else {
                                        _this.userArr.splice(0, 1);
                                        _this.userArr.push(newObj);
                                    }
                                    console.log(JSON.stringify(_this.userArr));
                                    localStorage.setItem('userInfo', JSON.stringify(_this.userArr));
                                    //console.log('login success');
                                    _this.$store.dispatch('set_selfInfo', data.ret)
                                    _this.$router.replace({
                                        name: 'chat',
                                        params: {userId: 123, userName: _this.username}
                                    });
                                }, function (err) {
                                    console.log('login error=>', err.ErrorInfo)
                                })
                        }

                    }).catch(e => {
                        console.log(e);
                        console.log(e.ErrorInfo);
                        _this.errorInfo = _this.$t("message.obj.check_network");
                    });
                }

            },
            checkVersion(){
                let _this = this;
                this.get_remoteversion().then(res => {
                    if(this.$store.state.card.remoteVersion > +versionCode){
                        this.$refs.version.init({
                            content: '检测到新版本，是否更新',
                            btns: {
                                ok: {
                                    txt: '确定',
                                    cb(){
                                        _this.download();
                                        return false;
                                    }
                                },
                                cancle: {
                                    txt: '取消'
                                }
                            }
                        });
                    }else{
                        this.$refs.version.init({
                            content: '当前是最新版本',
                            btns: {
                                cancle: {
                                    txt: '确定'
                                }
                            }
                        });
                    }
                })
                .catch(err => {
                    alert('网络超时', err);
                })
            },
            download(){
                shell.openExternal('http://chat.16lao.com/')
            },
        }
    };
</script>
<template>
    <div class="login-wrapper">
        <div id="del_dialog" v-show="dialogShow">
            <div class="title">
                <div class="left">
                    <img src="../../../../dist/images/warning.png"/>
                </div>
                <div class="right">
                    <span>{{$t("message.obj.del_mdir")}}</span>
                </div>
            </div>
            <div class="btn1">
                <span @click.stop="sureDel">{{$t("message.obj.sure")}}</span>
                <span @click.stop="cancelDel">{{$t("message.obj.off")}}</span>
            </div>
        </div>
        <div class="toolBar">
             <span class="min" v-on:click="page_min">
                <img src="../../../../dist/images/login_min.jpg"/>
            </span>
            <img v-on:click="page_close" class="close" src="../../../../dist/images/login_close.png"/>
        </div>
        <div class="main" id="main">
            <div class="content">
                <div class="user-input" v-bind:class="isShow?'active1':''">
                    <img src="../../../../dist/images/c_06.png" @click.stop="usernameFocus"
                         v-bind:class="{'drop-up':isShow}"/>
                    <input :placeholder="$t('message.obj.username_hd')" class="input-username"
                           v-model="username" v-on:keyup="Searchname()" v-on:click.stop/>
                </div>
                <div class="option-container" v-show="isShow">
                    <ul class=option-ul-list>
                        <li v-for="item in userArr" v-on:click.stop.prevent="nameSelect(item)">
                            <img class="headerImage" :src="item.headUrl"/>
                            {{item.name}}
                            <img class="del" src="../../../../dist/images/login_del.png"
                                 v-on:click.stop="del(item.name)"/>
                        </li>
                    </ul>
                </div>
                <div class="pwd-input">
                    <input :placeholder="$t('message.obj.pwd_hd')" class="input-pwd"
                           v-model="userpassword"
                           type="password" v-on:keyup="Searchname()" @keyup.enter="loginClick"/>
                </div>
                <div class="password">
                    <p @click.stop="remeber_pwd" v-if="isRemeber"><img src="../../../../dist/images/sel.png"
                                                                       style="margin-right: 6px"/>
                        {{$t("message.obj.rem_pwd")}}</p>
                    <p @click.stop="remeber_pwd" v-else><img src="../../../../dist/images/remeber.png"
                                                             style="margin-right: 6px"/>
                        {{$t("message.obj.rem_pwd")}}</p>
                    <p><span @click.stop="cli('forget')">{{$t("message.obj.forget_pwd")}}</span></p>
                </div>
                <div class="login" @click.stop="loginClick">
                    <span>{{$t("message.obj.IM_login")}}</span>
                </div>
                <div class="errorShow">
                    <span>{{errorInfo}}</span>
                    <span @click.stop="cli('register')">{{$t(("message.obj.register"))}}>></span>
                </div>
            </div>
        </div>

        <Tip ref="version"></Tip>
    </div>
</template>

<style>
    @import url('../../style/login.css');
</style>