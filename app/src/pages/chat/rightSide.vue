<!-- rightSide.vue Created by xh on 2018-4-19  -->
<template>
    <div class="rightSide" v-if="rsData">
        <div class="shop-info-box" v-if="!rsData.adDetail">
            <div class="shop-info">
                <div class="shop-name">
                    <a href="javascript: void(0);"><img :src="rsData.storeLogo" :alt="rsData.storeName"></a>
                    <div>
                        <h2><a href="javascript: void(0);">{{rsData.storeName}}</a></h2>
                        <div class="badge">
                            <i v-for="v of rsData.auditUrl" :key="v.code" :style="{background: `url(${v.identifyFlag})`}"></i>
                        </div>
                    </div>
                </div>
                <p>供货等级：<span class="level"><i :key="k" v-for="(v, k) of new Array(rsData.packageItemStart || 0)" class="highlight"></i></span></p>
                <p>经营模式：<em>{{rsData.businessModel}}</em></p>
                <p>企业地址：<em>{{rsData.thAddress}}</em></p>
                <p>手机：<em>{{rsData.contactTel}}</em></p>
                <p>固定电话：<em>{{rsData.contactPhone}}</em></p>
            </div>
            <div class="goods-recommend">
                <div class="goods-head">
                    <strong>本店推荐</strong>
                    <a target="_blank" :href="rsData.goodsListUrl || 'http://baidu.com'">更多&gt;</a>
                </div>
                <div class="goods-list">
                    <div class="goods-item" :data-index="k" v-for="(v, k) of rsData.listProduct" :style="{zIndex: 1}" :key="k">
                        <a target="_blank" :href="v.goodsUrl" :title="v.title">
                            <img :src="v.imgUrl" :alt="v.title">
                        </a>
                        <div class="goods-info">
                            <a :href="v.goodsUrl" :title="v.title">
                                <p>{{v.title}}</p>
                                <strong><i>{{v.currencyRemark}}</i>{{v.price}}</strong>
                            </a>
                        </div>
                    </div>
                    <div class="goods-index" v-if="rsData.listProduct && rsData.listProduct.length < 2">
                        <i @click="manualMove(k)" :class="{active: (k === current)}" v-for="(v, k) of rsData.listProduct" :key="k">{{k + 1}}</i>
                    </div>
                </div>
            </div>
        </div>
        <!-- 普通用户的广告预留位 -->
        <div v-html="rsData.adDetail" class="ad-box" v-else></div>
    </div>
</template>

<script>
    import fetch from '../../util/fetch'
    import crypto from 'crypto'
    import config from '../../../configs'
    import {Url} from 'url'
    import {mapGetters} from 'vuex'

    export default {
        data(){
            return {
                rsData: null,
                current: 0,
                timer: null
            }
        },
        computed: {
            ...mapGetters([
                'getSelToID',
                'getLan'
            ])
        },
        mounted(){
            // this.slider();
        },
        methods: {
            // DES 加密
            encryptByDES(message, key){
                var cipheriv = crypto.createCipheriv('des3', key, config.des3Iv);
                var crypted = cipheriv.update(message, 'utf8', 'base64');
                crypted += cipheriv.final('base64');
                return crypted;
            },
            // DES 解密
            decryptByDES(ciphertext, key){
                var decipheriv = crypto.createDecipheriv('des3', key, config.des3Iv);
                var crypted = decipheriv.update(ciphertext, 'base64', 'utf8');
                crypted += decipheriv.final('utf8');
                return crypted;
            },
            getData(dataSourceId, tbMemberId){
                var data = {
                    "method": 'queryAllInfo',
                    "dataSourceId": dataSourceId || this.getLan,
                    "tbMemberId": tbMemberId.match(/([^UID]+)/g)[0] || this.getSelToID.match(/([^UID]+)/g)[0]
                };
                var url = `http://10.240.0.130/leading/imProductAction.aspx`;
                var proxyUrl = `/api/ws/v1/imProductServiceWs/queryAllInfo`;
                fetch({
                    url,
                    method: 'get',
                    baseURL: '',
                    params: data
                })
                .then(res => {
                    let data = res.data;
                    this.rsData = data.ret;
                    this.$nextTick(function(){
                        this.slider();
                    });
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
            },
            slider(){
                let interval = 5 * 1000, direction = 'right', sliders = document.querySelectorAll(`[data-index]`), len = sliders.length;
                if(len < 2) return false;
                this.moveFn(direction);
                window.clearInterval(this.timer);
                this.timer = window.setInterval(() => {
                    this.current++;
                    if(this.current > len - 1){
                        this.current = 0;
                    }
                    this.moveFn(direction);
                }, interval);
            },
            moveFn(direction){
                let sliders = document.querySelectorAll(`[data-index]`), len = sliders.length;
                let currentSlide = document.querySelector(`.goods-item[data-index='${this.current}']`);
                let nextIndex = direction === 'right' ? this.current + 1 >= len ? 0 : this.current + 1 : this.current - 1 <= 0 ? len - 1 : this.current - 1;
                let nextSlide = document.querySelector(`.goods-item[data-index='${nextIndex}']`);
                Array.prototype.map.call(sliders, v => {
                    v.style.zIndex = 1;
                });
                nextSlide.style.zIndex = 4;
                currentSlide.style.zIndex = 5;
            },
            manualMove(index){
                if(index === this.current) return false;
                let direction = index < this.current ? 'left' : 'right';
                this.current = index;
                this.slider();
            }
        },
        watch: {
            getLan: function(val, oldVal){
                this.getData(val, this.getSelToID);
            },
            getSelToID: function(val, oldVal){
                this.getData(this.getLan, val);
            }
        }
    }
</script>

<style scoped>
    .rightSide{
        width: 199px;
        height: calc(100% - 50px);
        float: right;
        border-left: 1px solid #ddd;
        background-color: #fff;
    }
    .shop-info-box{
        padding: 10px;
        height: 100%;
        box-sizing: border-box;
        background-color: #f5f8fc;
    }
    .shop-name{
        display: flex;
    }
    .shop-name > a{
        width: 60px;
        height: 60px;
        margin-right: 10px;
        border: 1px solid #d1e1ff;
        box-sizing: border-box;
        border-radius: 10px;
        overflow: hidden;
        cursor: default;
    }
    .shop-name img{
        max-width: 100%;
        height: 100%;
    }
    .shop-name h2{
        margin: 10px 0;
        font-size: 14px;
        line-height: 14px;
    }
    .shop-name h2 a{
        color: #333;
        font-weight: normal;
        text-decoration: none;
        cursor: default;
    }
    .badge i{
        display: inline-block;
        width: 20px;
        height: 20px;
        background: url('../../../../dist/images/rihgt-icon.png') no-repeat 0 0;
    }
    .badge i.xin{
        background-position: 0 0;
    }
    .badge i.shen{
        background-position: -28px 0;
    }
    .badge i.jin{
        background-position: -56px 0;
    }
    .shop-info p{
        margin: 10px 0;
        font-size: 12px;
        color: #666;
        line-height: 18px;
    }
    .shop-info p em{
        font-style: normal;
        color: #333;
    }
    .level i{
        display: inline-block;
        width: 17px;
        height: 16px;
        margin-right: 3px;
        background: url('../../../../dist/images/rihgt-icon.png') no-repeat -27px -30px;
        vertical-align: text-bottom;    
    }
    .level i.highlight{
        background-position: 0 -30px;
    }
    .goods-recommend{
        border-top: 1px solid #d1e1ff;
        margin-top: 20px;
        padding-top: 22px;
    }
    .goods-head{
        display: flex;
        line-height: 1;
        margin-bottom: 10px;
    }
    .goods-head strong{
        flex: 1;
        font-size: 12px;
        font-weight: normal;
        color: #333;
    }
    .goods-head > a{
        font-size: 12px;
        color: #666;
        text-decoration: none;
    }
    .goods-list{
        position: relative;
        width: 100%;
        height: 230px;
        overflow: hidden;
    }
    .goods-index{
        position: absolute;
        right: 4px;
        top: 6px;
        font-size: 0;
        z-index: 20;
    }
    .goods-index i{
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-left: 4px;
        border-radius: 100%;
        background-color: #ccc;
        color: #fff;
        font-style: normal;
        font-size: 12px;
        line-height: 16px;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
    }
    .goods-index i.active{
        background-color: #ff5f10;
    }
    .goods-item{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        border: 1px solid #d1e1ff;
    }
    .goods-item > a{
        display: block;
        width: 100%;
        height: 178px;
    }
    .goods-item img{
        max-width: 100%;
        width: 100%;
        height: 100%;
        background-color: #fff;
    }
    .goods-item .goods-info{
        padding: 6px;
        background-color: #fff;
    }
    .goods-item .goods-info a{
        display: flex;
        align-items: center;
        text-decoration: none;
    }
    .goods-item .goods-info p{
        flex: 1;
        text-decoration: none;
        font-size: 12px;
        color: #333;
        line-height: 18px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    .goods-item .goods-info strong i{
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        vertical-align: middle;
    }
    .goods-item .goods-info strong{
        color: #c82b24;
        font-size: 18px;
        text-align: center;
    }
</style>