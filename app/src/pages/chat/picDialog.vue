<script>
    export default {
        props:['imgsrc'],
        methods: {
            picDialogClosed(){
                this.$emit('picDialogClosed',false);
            }
        }
    };
</script>

<template>
    <div class="pic_dialog" id="pic_dialog">
        <div class="pic_box">
        <div class="pic_dialog_header">     
            <span class="pic_dialog_closed" v-on:click = "picDialogClosed">x</span>
        </div>
        <div class="pic_dialog_body" id="pic_dialog_body">
            <img :src = "imgsrc" alt="">
        </div>
        </div>
    </div>
</template>
<style>
    .pic_dialog{
        width:100%;
        height:100%;
        position:absolute;
        top:0;
        left:0;
        z-index:999;
        background: rgba(0,0,0,0.3);
    }
    .pic_dialog_body{
        max-width:1200px;
        min-width:220px;
        min-height:220px;
        background: #fff;
    }
    .pic_dialog_header{
        width:100%;
        height:25px;
        line-height:25px;
        position:relative;
        background:#fff;
    }
    .pic_dialog_closed{
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
    .pic_dialog_closed:hover{
        background:red;
    }
    .pic_box{
        position:fixed;
        top:50%;
        left:50%;
        text-align:center;
        max-width:1200px;
        min-width:220px;
        min-height:220px;
        transform:translate(-50%,-50%);
        -ms-transform:translate(-50%,-50%); 	/* IE 9 */
        -moz-transform:translate(-50%,-50%); 	/* Firefox */
        -webkit-transform:translate(-50%,-50%); /* Safari 和 Chrome */
        -o-transform:translate(-50%,-50%); 
    }
    .pic_dialog_body>div{
        margin-bottom:8px;
        display:block;
        text-align:center;
        vertical-align:middle;
    }
    .pic_dialog_body>div>img{
        max-width:400px;
    }
</style>