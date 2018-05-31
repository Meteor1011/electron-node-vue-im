<script>
    import { mapGetters } from 'vuex';
    import {setFriendHeadImg, setRead, delFriend, getAllFriend} from '../../util/wrapsdk.js'
    import getSupportLan from '../../util/getSupportLan'
    export default {
        data() {
            var data = {
                 selToID:this.$store.getters.getSelToID,//默认显示第一个
                 filterKey:'',
                 last:null,
                 showLan:false,
                 lan:this.$store.getters.getTransLan
            };
            return data;
        },
        mounted(){
            this.$nextTick(function () {
                this._getSupportLan();
            });
            this.clickLanlist();
        },
        methods:{
            //点击某个好友显示对应的聊天记录
            selectFriend(member, friendHeadimg, friendName){
                if(member == '' || member == undefined) return;
                if(this.selToID== member ) {
                   return;
                };
                friendHeadimg = friendHeadimg || ''
                this.selToID=member;
                this.$store.dispatch('select_friend',member);
                this.$store.dispatch('try_get_msg',member);
                this.$store.dispatch('getFriendName', friendName);
                setFriendHeadImg(friendHeadimg);
                setRead(member);
            },
            onKeyup(e) {
                clearTimeout(this.last)
                this.last = setTimeout(()=>{
                    this.filterKey = e.target.value;
                },300);
            },
            changeLan(lan){
                this.$store.dispatch('setTransLan',lan)
            },
            _getSupportLan(){
                let _this = this;
                getSupportLan().then(data=>{
                    var index,
                    curLan = _this.$store.getters.GetFanyiLan,
                    count = data.length;
                    for(index = 0; index < count; index++){
                        if(curLan == data[index].shortname){
                            var lanBox=document.querySelector('#sel_lan');
                            if(lanBox){
                                lanBox.setAttribute('data-i',curLan)
                                lanBox.innerHTML=data[index].lang;
                            }
                            break;
                        }
                    }
                });
                var divBox=document.querySelector('#sel_lan');
                document.querySelector('.lanBox').addEventListener('click',function(e){
                    var e=e||event;
                    divBox.innerHTML='';
                    if(e.target.nodeName=='LI'){
                        var child=e.target.innerText;
                        divBox.title=child;
                        _this.changeLan(e.target.getAttribute('data-i'));
                        divBox.setAttribute('data-i',e.target.getAttribute('data-i'))
                        divBox.innerHTML=child;
                        _this.showLan = false;
                    }
                });
            },
            //显示或隐藏翻译语言列表
            clickLanlist(){
                var self = this;
                document.body.addEventListener('click',function(e){
                    if(e.target.className == 'lan_icon'){
                        self.openLans();
                    }else{
                        self.showLan = false;
                    }
                    e.stopPropagation();
                })
            },
            //打开翻译语言列表
            openLans(){
                if(this.showLan){
                    this.showLan = false;
                }else{
                    this.showLan = true;
                    var _this = this;
                    document.getElementById('editor').contentWindow.document.
                    getElementsByTagName('body')[0].addEventListener('click',function () {
                        _this.showLan = false;
                    })
                }
            },
            //删除好友
            closedFriend(index){
                var selToID = this.filterFriends[index].selToID;
                var friendNum = this.filterFriends.length-1;
                var self = this;
                delFriend(selToID,function() {
                    self.$store.dispatch('del_friends',selToID);

                    getAllFriend();
                    var friendIndex;
                    if(index==friendNum && index>=0){
                       friendIndex = index-1;
                    }else{
                        friendIndex = index;
                    }
                    var friendHeadimg = self.filterFriends[friendIndex].headImage,
                        friendName = self.filterFriends[friendIndex].friendName,
                        member = self.filterFriends[friendIndex].selToID ||"";
                    if(member == ""){
                        return
                    }
                    self.selectFriend(member, friendHeadimg, friendName);
                })
            }
        },
        computed:{
            filterFriends:function(){
                var sessons=this.$store.getters.getFrinds;
                if(sessons){
                    return sessons.filter((sesson)=>(sesson.friendName).includes(this.filterKey));
                }else{
                    return ''
                }
            },
            getSel:function(){
                this.selToID = this.$store.getters.getSelToID;
                return this.$store.getters.getSelToID;
            }
        }
    };

</script>

<template>
<div class="list">
    <footer>
        <input class="search" type="text" :placeholder="$t('message.obj.search')" @keyup="onKeyup">
    </footer>
    <div class="mList">
        <ul>
            <li v-for="(item,index) in filterFriends" :class="{ active: item.selToID == getSel }" @click="selectFriend(item.selToID,item.headImage,item.friendName)">
                <img class="avatar" :class="{masking:item.offline}"  width="32" height="32" :alt="item.friendName" :src="item.headImage">
                <p class="name" :title="item.friendName">{{item.friendName}}</p>
                <span class="msg_hint" v-show="item.unRead"></span>
                <em class = "closed_friend" v-on:click.stop = "closedFriend(index)"></em>
            </li>
        </ul>
    </div>

    <div class="lanList">
        <span  title="翻译的语言" >
            <img style="vertical-align:bottom;" src="images/lans.jpg" title="翻译的语言"/>
        </span>
        <em id="sel_lan" title="中文" data-i="zh-CN">{{lan}}</em><i ref = "lanBtn" class = "lan_icon"></i>
        <div v-show="showLan" class="box">
            <div class="lanBox">
               	
            </div>
        </div>
    </div>
</div>
</template>

<style>
    @import url('../../style/friendList.css');
</style>