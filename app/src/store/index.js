import Vue from 'vue';
import Vuex from 'vuex';
import friendList from './modules/friendList';
import messageList from './modules/messageList';
import transOption from './modules/transOption';
import card from './modules/card'
import getters from './getters';
import { logout } from '../util/wrapsdk.js'
const ipc = require('electron').ipcRenderer;

var talkto;
ipc.on('NEEDTALK',(event, arg) => {
    if(arg[1]==undefined){
        return;
    }else{
        arg=arg[1].split('://')[1].slice(0,-1);
        talkto = arg == -1 ? '': arg;
        if(talkto !== ''){
        store.dispatch('set_needTalk','UID'+talkto)
        store.dispatch('need_talk','UID'+talkto)
      }
    }
})
function logoutcallback(resp){
  ipc.send('now-quit')
}
ipc.on('quit_im',(event, arg)=>{
  logout(logoutcallback,logoutcallback)
})
Vue.use(Vuex);

var store = new Vuex.Store({
  modules: {
    friendList,
    messageList,
    card,
    transOption
  },
  getters
});

(function(store){
  talkto = ipc.sendSync('talkto');
  if(talkto != ''){
    store.dispatch('set_needTalk','UID'+talkto)
    store.dispatch('need_talk','UID'+talkto)
  }
})(store)

export default store
