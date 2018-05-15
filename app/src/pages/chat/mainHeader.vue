<template>
    <div class="mainHeader">
        <span>{{_getFriendName}}</span>
        <em>
            <img src="images/hd_min.jpg" @click="main_page_min"/>
            <img src="images/hd_max.jpg" @click="main_page_max" v-if="show"/>
            <img src="images/hd_restore.png" @click="main_page_max" v-else/>
            <img src="images/hd_close.jpg" @click="main_page_close"/>
        </em>
    </div>
</template>

<script>
    const {ipcRenderer} = require('electron');
    export default {
        data() {
            return {
                friendName: "",
                show:true
            }
        },
        computed: {
            _getFriendName() {
                return this.$store.getters.getFriendName;
            }
        },
        mounted:function () {
            this.$nextTick(function () {
                ipcRenderer.on('reply',(event,arg) => {
                    if(arg == 'max'){
                        this.show = false;
                    }else if(arg == 'min'){
                        this.show = true;
                    }
                })
            });
        },
        methods: {
            main_page_min: function () {
                ipcRenderer.send('msg', 'setMin');
            },
            main_page_max: function () {
                if(this.show){
                    ipcRenderer.send('msg', 'setMax');
                }else{
                    ipcRenderer.send('msg', 'setRestore');
                }
                this.show = !this.show;
            },
            main_page_close: function () {
                ipcRenderer.send('msg', 'close');
            },
        }
    }
</script>

<style scoped>
    .mainHeader {
        width: 100%;
        height: 49px;
        border-bottom: 1px solid #ddd;
        background: #f5f8fc;
        -webkit-app-region: drag;
    }

    .mainHeader > span {
        font-size: 17px;
        float: left;
        width: 50%;
        padding-left: 22px;
        line-height: 49px;
    }

    .mainHeader > em {
        float: right;
        width: 50%;
        text-align: right;
        -webkit-app-region: no-drag;
    }
</style>



