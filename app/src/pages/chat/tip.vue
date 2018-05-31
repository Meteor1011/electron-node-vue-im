<!-- tip.vue Created by xh on 2018-5-9  -->
<template>
    <div class="tip-box" v-if="state">
        <div class="tip">
            <div class="tip-content">{{content}}</div>
            <div class="tip-btn">
                <a v-for="(v, k) of btns" :key="k" @click="clickHandle(v.cb)" href="javascript: void(0);" :title="v.txt" >{{v.txt}}</a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                state: false,
                content: '',
                btns: {
                    ok: {
                        txt: '确定',
                        cb: function(){}
                    },
                    cancel: {
                        txt: '取消',
                        cb: function(){}
                    }
                }
            }
        },
        methods: {
            init(json){
                this.state = true;
                this.content = json.content;
                this.btns = json.btns ? Object.assign({}, json.btns) : Object.assign({}, this.btns);
            },
            close(){
                this.state = false;
            },
            clickHandle(cb){
                cb && cb();
                this.close();
            }
        }
    }
</script>

<style scoped>
    .tip-box{
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 20;
    }
    .tip{
        position: absolute;
        left: 50%;
        top: 50%;
        min-width: 256px;
        max-width: 316px;
        transform: translate(-50%, -50%);
        background-color: #fff;
        border-radius: 10px;
        padding: 30px 50px 20px;
        box-shadow: 0 0 4px 2px rgba(0, 0, 0, .2);
    }
    .tip-content{
        margin-bottom: 20px;
        color: #333;
        line-height: 1.5;
        text-align: center;
    }
    .tip-btn{
        text-align: center;
        white-space: nowrap;
    }
    .tip-btn a{
        display: inline-block;
        padding: 6px 16px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 12px;
        text-decoration: none;
        color: #333;
        width: 88px;
        line-height: 1;
        height: 26px;
        margin: 0px 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .tip-btn a:first-child{
        color: #fff;
        border-color: #2799ea;
        background-color: #2799ea;
    }
</style>
 