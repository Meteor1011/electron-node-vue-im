<script>
    export default {
        props:['imgsrc'],
        methods: {
            picDialogClosed(){
                this.$emit('picDialogClosed',false);
            },
            bigimg(i){
                var zoom = parseInt(i.style.zoom,10)||100;
                zoom += event.wheelDelta / 12;
                if(zoom > 0 )
                i.style.zoom=zoom+'%';
                return false;
            }
        },
        mounted(){
            var self = this;
            document.getElementById("aa").addEventListener('mousewheel',function(e){
                self.bigimg(e.target)
            })
        }
    };
</script>

<template>
    <div class="pic_dialog" id="pic_dialog">
        <div class="pic_box">
            <span class="pic_dialog_closed" v-on:click = "picDialogClosed">x</span>
            <div class="pic_dialog_body" id="pic_dialog_body">
                <img id="aa" :src = "imgsrc" alt="">
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
        overflow: auto;
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
        z-index: 30;
    }
    .pic_dialog_closed:hover{
        background:red;
    }
    .pic_box{
        position:absolute;
        top:50%;
        left:50%;
        text-align:center;
        max-width:922px;
        min-width:220px;
        min-height:220px;
        max-height: 800px;
        transform:translate(-50%,-50%);
        -ms-transform:translate(-50%,-50%); 	/* IE 9 */
        -moz-transform:translate(-50%,-50%); 	/* Firefox */
        -webkit-transform:translate(-50%,-50%); /* Safari 和 Chrome */
        -o-transform:translate(-50%,-50%); 
        overflow: hidden;
    }
    .pic_dialog_body>img{
        max-width:922px;
        max-height: 800px;
        vertical-align: bottom;
    }
</style>