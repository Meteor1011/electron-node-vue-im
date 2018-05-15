import axios from 'axios';


// 创建axios实例
const prelogin = axios.create({
  baseURL: "http://140.143.232.160:3000", // api的base_url //测试环境
  //baseURL: "http://im.1818lao.com", // api的base_url 线上环境
  timeout: 5000                  // 请求超时时间
});


export default prelogin;
