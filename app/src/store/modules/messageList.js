//import Vue from 'vue'
import { getLastHistoryMsg } from "../../util/wrapsdk.js";
var g_msgTip = [
    "你还没有选中好友，暂不能聊天",
    "点击获取更多消息",
    "正在获取历史消息...",
    "没有更多历史消息"
];
const messageList = {
    state: {
      //msgmap:new Map(), //消息数组,
      currentMsg:[],
      selToID:"",
      msgTip:g_msgTip[0],
      transed:new Map()
    },
    mutations: {
      //初始化消息，用于切换好友时重新拉取消息
      INIT_MSG: (state,msgobj) => {
        state.currentMsg = msgobj.msgList||[];
        state.msgtrigger++;
      },
      //追加消息,用于新消息和获取更多历史消息
      APPEND_MSG: (state, msgobj) =>{
        msgobj.msgList[0].selToID==state.selToID? state.currentMsg.push(msgobj.msgList[0]):""
        state.msgtrigger++;
      },
      //选择新的好友进行聊天
      CHANG_FRIEND:(state, friendId) =>{
        if(friendId == '') return;
        state.selToID=friendId;
        state.msgTip = g_msgTip[1];
          state.currentMsg = [];
          getLastHistoryMsg(friendId);
      },
      APPEND_HISTORYMSG:(state,msgobj)=>{
        state.currentMsg=msgobj.msgList.concat(state.currentMsg);
        state.msgtrigger++;
      },
      //消息提示
      SET_MSGTIP:(state, msgtip)=>{
        state.msgTip = g_msgTip[msgtip];
      },
      //消息已读通知
      SET_MSGREAD:(state,selToID)=>{
        console.log(selToID)
      },
      //
      NEED_TALK:(state, selToID)=>{
        state.selToID = selToID;
      },
      TRANS_DONE:(state,obj)=>{
        state.transed.set(obj.uid, obj.transText);
        for(let i in state.currentMsg){
          if(state.currentMsg[i].uniqueId === obj.uid){
            let oldvale = state.currentMsg[i];
            state.currentMsg.splice(i,1,oldvale)
            return;
          }
        }
      }
    },
    actions: {
      init_msg: ({ commit },msgobj) => {
        commit('INIT_MSG',msgobj);
      },
      append_msg:({ commit },msgobj)=>{
        commit('APPEND_MSG',msgobj);
      },
      try_get_msg:({ commit, state }, friendId)=>{
        commit('CHANG_FRIEND',friendId);
      },
      append_historymsg:({commit},msgobj)=>{
        commit('APPEND_HISTORYMSG',msgobj);
      },
      set_msgtip:({commit},msgtip)=>{
        commit('SET_MSGTIP',msgtip);
      },
      setMsgRead({commit},selToID){
        commit('SET_MSGREAD',selToID);
      },
      need_talk({commit}, selToID){
        selToID = selToID.split(',')[0];
        commit('NEED_TALK',selToID);
        commit('CHANG_FRIEND',selToID);
      },
      check_need({commit,state}){
        commit('CHANG_FRIEND',state.selToID);
      },
      trans_done({commit}, obj){
        commit("TRANS_DONE", obj)
      }
    }
  };
  
  export default messageList;