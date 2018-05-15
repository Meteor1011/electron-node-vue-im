var { ipcRenderer, clipboard, nativeImage, Tray, remote } = require('electron');
var fs = require('fs')

var img = remote.getGlobal('def').screenShot; //localStorage['image'];

/*
 *
 *原理运用遮罩层，俩个canvas，底下为背景原图产生一个黑色背景画布，上层选区，将选中像素绘制到选区
 *鼠标按下移动鼠标产生一个矩形框，
 *
 */
class Screen {
    constructor(cas, casMask, src) {
        this.canvas = document.getElementById(cas);
        this.canvasMask = document.getElementById(casMask);

        this.context = this.canvas.getContext("2d");
        this.contextMask = this.canvasMask.getContext("2d");

        this.width = screen.width;
        this.height = screen.height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;


        this.image = new Image();
        this.image.src = src;

        this.cuted = false;
        this.isShowTool = false;

        this.tool = document.querySelectorAll('.tool')[0];
        this.tip = document.querySelectorAll('.tipNum')[0];

        this.leftTopCursor = document.querySelectorAll('.left_top')[0];
        this.rightTopCursor = document.querySelectorAll('.right_top')[0];
        this.leftBottomCursor = document.querySelectorAll('.left_bottom')[0];
        this.rightBottomCursor = document.querySelectorAll('.right_bottom')[0];




        // 原本是将屏幕截图image画到this.context画布上的 
        //  不知道为何画出来的是空白的
        // 取而代之的方式是全屏一张图片
        document.getElementsByTagName('body')[0].appendChild(this.image);
        // this.drawImg(this.image); 


        this.createMask();

        this.getMouse();



        // 绑定this到原型链上
        this.drawImg = this.drawImg.bind(this)
        this.getMouse = this.getMouse.bind(this)
        this.clearCtx = this.clearCtx.bind(this)
        this.createRect = this.createRect.bind(this)
        this.createMask = this.createMask.bind(this)
        this.createReatImage = this.createReatImage.bind(this)
        this.tipShow = this.tipShow.bind(this)
        this.showTool = this.showTool.bind(this)
        this.hideTool = this.hideTool.bind(this)
        this.close = this.close.bind(this)
        this.sendMsg = this.sendMsg.bind(this)
        this.RGBA2ImageData = this.RGBA2ImageData.bind(this)
        this.dragEvent = this.dragEvent.bind(this)
    }

    // 创建一个黑色透明蒙版画布
    createMask() {
        // 创建一个canvas
        var maskCanvas = document.createElement('canvas');
        maskCanvas.width = this.width;
        maskCanvas.height = this.height;
        var maskCtx = maskCanvas.getContext('2d');
        maskCtx.fillStyle = "rgba(0, 0, 0, 0.4)";
        maskCtx.fillRect(0, 0, this.width, this.height);
        maskCtx.restore();
        // document.appendChild(maskCanvas)
        this.drawImg(maskCanvas);
    }

    // 画布上贴图
    drawImg(src) {
        this.context.drawImage(src, 0, 0, this.width, this.height);
    }

    // 获取鼠标位置
    getMouse() {
        var end = { x: 0, y: 0 };
        this.start = { x: 0, y: 0 };
        var that = this;
        document.addEventListener('mousedown', down, false);
        document.addEventListener('mouseup', up, false);

        // 鼠标按下
        function down(ev) {
            // console.log(ev)
            document.onselectstart = function() {
                return false;
            }
            if (ev.target.dataset.done) {
                that.done();
                return false;
            } else if (ev.target.dataset.save) {
                that.save();
                return false;
            } else if (ev.target.dataset.cancel) {
                that.cancel();
                return false;
            } else if (ev.target.dataset.close) {
                that.close();
                return false;
            } else if (ev.target.dataset.drag) {
                that.canvas_x = ev.clientX - that.canvasMask.offsetLeft;
                that.canvas_y = ev.clientY - that.canvasMask.offsetTop;
                document.addEventListener('mousemove', move, false);
                return false;
            } else if (ev.target.dataset.zoom) {
                console.log(ev.target.dataset.zoom)
                that.start.x = ev.clientX - that.canvasMask.offsetLeft;
                that.start.y = ev.clientY - that.canvasMask.offsetTop;
                //document.addEventListener('mousemove', move, false);
                return false;
            } else {
                that.start.x = ev.pageX;
                that.start.y = ev.pageY;
                document.addEventListener('mousemove', move, false);
            }
        }

        // 鼠标移动
        function move(ev) {
            console.log('ee')
            if (!that.cuted) {
                // console.log('<<<---cuted---->>>')
                that.tipShow(end.x, end.y, that.start.x, that.start.y);
                that.clearCtx();
                end.x = ev.pageX;
                end.y = ev.pageY;
                that.createRect(end.x, end.y, that.start.x, that.start.y);
                that.maskShow(end.x, end.y, that.start.x, that.start.y);
                return false;
            } else if (ev.target.dataset.drag) {
                console.log('<<<---drag---->>>')
                that.dragEvent(ev.pageX, ev.pageY);
                return false;
            } else if (ev.target.dataset.zoom) {
                // console.log('<<<---zoom---->>>')

                // that.tipShow(end.x, end.y, that.start.x, that.start.y);
                that.clearCtx();
                // console.log(ev)
                end.x = ev.pageX;
                end.y = ev.pageY;
                console.log(' %d | %d |%d |%d', end.x, end.y, that.start.x, that.start.y)

                that.createRect(end.x, end.y, that.start.x, that.start.y);
                that.maskShow(end.x, end.y, that.start.x, that.start.y);
                return false;
            }
        }

        // 鼠标抬起
        function up(ev) {
            if (!ev.target.dataset.done && !ev.target.dataset.cancel && !ev.target.dataset.save && !ev.target.dataset.close && !ev.target.dataset.drag && !ev.target.dataset.zoom) {
                end.x = ev.pageX;
                end.y = ev.pageY;
                document.removeEventListener('mousemove', move);
                that.isShowTool && that.showTool(end.x, end.y, that.start.x, that.start.y);

            } else if (ev.target.dataset.drag) {
                var _x = parseInt(that.canvasMask.style.left) + that.canvasMask.width,
                    _y = parseInt(that.canvasMask.style.top) + that.canvasMask.height,
                    x0 = parseInt(that.canvasMask.style.left),
                    y0 = parseInt(that.canvasMask.style.top);
                that.showTool(_x, _y, x0, y0);

                document.removeEventListener('mousemove', move);

            }
            return false;
        }
        return {
            end: end
        }
    }

    // 绘制选区
    createRect(x, y, _x, _y, data) {
        // 创建选区矩形
        // 复制选区像素数据到主画布中
        this.imgData = this.createReatImage(x, y, _x, _y);
        if (!data) {
            this.canvasMask.width = this.imgData.width;
            this.canvasMask.height = this.imgData.height;
        }
        var img = this.contextMask.createImageData(this.imgData.width, this.imgData.height);
        img.data.set(this.imgData.data);
        this.contextMask.putImageData(img, 0, 0);

        this.isShowTool = true;

        this.hideTool();


    }

    // 设置canvasmask位置及边框
    maskShow(x, y, _x, _y) {
        this.canvasMask.style.display = 'block';
        this.canvasMask.style.border = '1px solid #FFF';
        this.canvasMask.style.left = (_x < x ? _x : x) + 'px';
        this.canvasMask.style.top = (_y < y ? _y - 1 : y - 1) + 'px';
    }

    // 清空画布
    clearCtx() {
        this.contextMask.clearRect(0, 0, this.width, this.height);
        this.canvasMask.style.display = 'none';
        this.canvasMask.style.border = 'none';
    }

    // 返回选区矩阵数据
    createReatImage(x, y, _x, _y) {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(this.image, 0, 0);
        var imgData = ctx.getImageData(_x, _y, x - _x, y - _y);
        return imgData;
    }

    // 矩阵图转base64
    RGBA2ImageData(__imgMat) {
        var width = __imgMat.width,
            height = __imgMat.height;
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        var imgData = ctx.createImageData(width, height);
        imgData.data.set(__imgMat.data);
        ctx.putImageData(imgData, 0, 0);
        return canvas.toDataURL();
    }

    // 选区数值提示
    tipShow(x, y, _x, _y) {
        this.tip.innerHTML = Math.abs(x - _x) + '×' + Math.abs(y - _y);
        this.tip.style.display = 'inline-block';
        this.tip.style.left = (_x < x ? _x : x) + 'px';
        var t = (_y < y ? _y - 20 : y - 20);
        if (t < 5) {
            t = _y;
        }
        this.tip.style.top = t + 'px';
    }

    // 隐藏选区提示
    tipHide() {
        this.tip.style.display = 'none';
    }

    // 选区完成显示工具栏
    showTool(x, y, _x, _y) {

        this.tool.style.display = 'block';
        this.tool.style.left = (_x < x ? x - 110 : _x) + 'px';
        if ((screen.height - y) < 50 && !(_y < 21)) {
            this.tool.style.top = (_y - 21) + 'px';
        } else if ((screen.height - y) < 50 && _y < 21) {
            this.tool.style.top = _y + 'px';
        } else {
            this.tool.style.top = y + 3 + 'px';
        }
        this.cuted = true;
        this.isShowTool = false;



        // 这个方法不应该放在这里，与工具栏解耦
        this.showCursor(x, y, _x, _y);
    }

    // 显示缩放框 
    showCursor(x, y, _x, _y) {

        this.leftTopCursor.style.top = _y + 'px';
        this.leftTopCursor.style.left = _x + 'px';

        this.rightTopCursor.style.top = _y + 'px';
        this.rightTopCursor.style.left = x - 15 + 'px';

        this.leftBottomCursor.style.top = (y - 15) + 'px';
        this.leftBottomCursor.style.left = _x + 'px';

        this.rightBottomCursor.style.left = (x - 15) + 'px';
        this.rightBottomCursor.style.top = (y - 15) + 'px';

        this.leftTopCursor.style.display = 'block';
        this.rightTopCursor.style.display = 'block';
        this.leftBottomCursor.style.display = 'block';
        this.rightBottomCursor.style.display = 'block';
    }

    // 隐藏工具栏
    hideTool() {
        this.tool.style.display = 'none';
        this.leftTopCursor.style.display = 'none';
        this.rightTopCursor.style.display = 'none';
        this.leftBottomCursor.style.display = 'none';
        this.rightBottomCursor.style.display = 'none';
    }

    // 拖拽框设置
    // 拖拽动作
    dragEvent(x, y) {

        var w = this.canvas.offsetWidth;
        var h = this.canvas.offsetHeight;
        var l = x - this.canvas_x, //将距离变量存起来进行判断
            t = y - this.canvas_y; //将距离变量存起来进行判断

        if (l < 0) {
            this.canvasMask.style.left = 0 + 'px';
        } else if (l > (w - this.canvasMask.width)) {
            this.canvasMask.style.left = w - this.canvasMask.width + 'px';
        } else {
            this.canvasMask.style.left = l + 'px';
        }
        if (t < 0) {
            this.canvasMask.style.top = 0 + 'px';
        } else if (t > h - this.canvasMask.height) {
            this.canvasMask.style.top = h - this.canvasMask.height + 'px';
        } else {
            this.canvasMask.style.top = t + 'px';
        }
        // 设置选区
        var _x = parseInt(this.canvasMask.style.left) + this.canvasMask.width,
            _y = parseInt(this.canvasMask.style.top) + this.canvasMask.height,
            x0 = parseInt(this.canvasMask.style.left),
            y0 = parseInt(this.canvasMask.style.top);

        // 重新绘制选区
        this.createRect(_x, _y, x0, y0, true);
        // 隐藏工具栏
        this.hideTool();
        this.tipShow(_x, _y, x0, y0);

    }

    //取消操作
    cancel() {
        this.cuted = false;
        this.clearCtx();
        this.hideTool();
        this.tipHide();
    }

    // 完成写入剪切板
    done() {
        var imgData = this.RGBA2ImageData(this.imgData);
        clipboard.writeImage(nativeImage.createFromDataURL(imgData));
        this.close();
    }

    // 保存制定路径
    save() {
        // win.setAlwaysOnTop(false);
        var that = this;
        var imgData = this.RGBA2ImageData(this.imgData);
        remote.getCurrentWindow().setAlwaysOnTop(false);

        remote.dialog.showSaveDialog({ filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }] }, function(pathStr) {
            if (pathStr) {
                fs.writeFile(pathStr, new Buffer(imgData.replace('data:image/png;base64,', ''), 'base64'), function() {
                    that.close();
                });
            } else {
                remote.getCurrentWindow().setAlwaysOnTop(true)
            }
        });
    }

    // 退出截图
    close() {
        this.sendMsg('close', null)
    }

    // 通信
    sendMsg(type, msg) {
        ipcRenderer.send('screenshot-page', { type: type, message: msg })
    }
}

var cut = new Screen('canvas', 'canvasMask', img);

// console.log(cut.getMouse())
