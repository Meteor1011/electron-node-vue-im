<script>
    export default {
        props:['imgsrc'],
        methods: {
            picDialogClosed(){
                this.$emit('picDialogClosed',false);
                var oDiv = document.getElementById("picScale");
                oDiv.style.left = "50%";
                oDiv.style.top = "50%";
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
            var oDiv = document.getElementById("picScale")
            oDiv.addEventListener('mousewheel',function(e){
                self.bigimg(e.target)
            });
            oDiv.onmousedown = function (e) {
                //鼠标按下，计算当前元素距离可视区的距离
                let disX = e.clientX - oDiv.offsetLeft;
                let disY = e.clientY - oDiv.offsetTop;
                e.preventDefault();
                document.onmousemove = function (e) {
                    e.preventDefault();
                    //通过事件委托，计算移动的距离 
                    let l = e.clientX - disX;
                    let t = e.clientY - disY;
                    //移动当前元素  
                    oDiv.style.left = l + 'px';
                    oDiv.style.top = t + 'px';
                };
                document.onmouseup = function (e) {
                
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }
        }
    };
</script>

<template>
    <div class="pic_dialog" id="pic_dialog">
        <div class="pic_box">
            <span class="pic_dialog_closed" v-on:click = "picDialogClosed">x</span>
            <div class="pic_dialog_body" id="pic_dialog_body">
                <img id="picScale" :src = "imgsrc" alt="">
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
        /* max-width:1200px;
        min-width:220px;
        min-height:220px;
        background: #fff; */
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
        width:800px;
        height: 500px;
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
        cursor: move;
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
    }
</style>