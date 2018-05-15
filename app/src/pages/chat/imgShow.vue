<script>
    import {sendPic} from '../../util/wrapsdk.js'

    export default {
        data() {
            var data = {
                   imgname:''
                }
            return data;
        },
        methods: {
            imgClosed(){
                this.$emit('imgClosed',false);
            },
            _sendPic(){
                this.imgClosed();
                var selToID=this.$store.getters.getSelToID;
                sendPic(selToID);
            }
        }
    };
</script>

<template>
    <div class="imgShow">
        <div class="imgShow_body">
            <div class="header">     
                <span class="imgShow_closed" v-on:click="imgClosed">x</span>
            </div>
            <div id="previewPicDiv">
                
            </div>
            <div class="header">
                <span class="img_btn" v-on:click="_sendPic">发送图片</span>
            </div>
        </div>
    </div>
</template>
<style>
    .header{
        width:100%;
        height:25px;
        line-height:25px;
        position:relative;
        background:#fff;
    }
    .imgShow{
        width:100%;
        height:100%;
        position:absolute;
        top:0;
        left:0;
        z-index:999;
        background: rgba(0,0,0,0.3);
    }
    .imgShow_closed{
        position: absolute;
        top: 0px;
        display: inline-block;
        width: 25px;
        height: 25px;
        right:0px;
        color:#000;
        text-align: center;
        cursor:pointer;
        line-height:25px;
        
    }
    .imgShow_closed:hover{
        background:red;
    }
    .imgShow_body{
        position:fixed;
        top:50%;
        left:50%;
        text-align:center;
        max-width:600px;
        min-width:200px;
        max-height:200px;
        min-height:200px;
        transform:translate(-50%,-50%);
        -ms-transform:translate(-50%,-50%); 	/* IE 9 */
        -moz-transform:translate(-50%,-50%); 	/* Firefox */
        -webkit-transform:translate(-50%,-50%); /* Safari 和 Chrome */
        -o-transform:translate(-50%,-50%); 
    }
    .imgShow_body>div{
        margin-bottom:8px;
        display:block;
        text-align:center;
        vertical-align:middle;
    }
    .imgShow_body>div>img{
        max-width:400px;
    }
    .img_btn{
        padding:2px 5px;
        cursor:pointer;
        border-radius:3px;
        background:#fff;
        min-width:60px;
        text-align:center;
    }
    .img_btn:hover{
         background:#58B7FF;
         color:#fff;
    }
    #previewPicDiv{
        background:#fff;
        max-width: 600px;
        min-width: 200px;
        max-height: 200px;
        min-height: 200px;
        overflow: hidden;
        display: flex;
        align-items: center;
    }
</style>