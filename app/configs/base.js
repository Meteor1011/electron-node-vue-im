module.exports = {
    target: {
        appUrl: "http://im.1818lao.com/src/index.html", //请求的目标地址
        apiUrl: "https://api.zjlao.com/v2" //api请求地址
    },
    base: '/', //路由根路径
    publicPath: '/', //服务器所在的路径
    title: '16Chat',
    // 用环境变量来判断右侧模块接口的ip或者域名  development 对应测试环境，test对应单点环境，production对应线上环境
    rDomain: process.env.NODE_ENV == 'development' ? '10.240.0.34' : process.env.NODE_ENV == 'testing' ? '140.143.48.201' : process.env.NODE_ENV == 'production' ? '140.143.48.201' : ''

}