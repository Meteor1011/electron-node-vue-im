import axios from 'axios';

const trans_srv = axios.create({
  baseURL: "http://trans.1818lao.com", // api的base_url
  timeout: 5000                  // 请求超时时间
});

export default trans_srv;
