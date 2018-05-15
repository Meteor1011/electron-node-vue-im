/**
 * getRemoteVersion.js Created by xh on 2018-5-11
 */
import fetch from './fetch'

export default function getRemoteVersion(){
    return fetch({
        method: 'get',
        url: `http://140.143.232.160:3000/sys/app-version`,
        baseURL: ''
    });
}
