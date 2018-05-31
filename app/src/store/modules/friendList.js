
//import Vue from 'vue'
import { applyaddfriend } from '../../util/wrapsdk.js'
import { getUserStatus } from '../../util/getUserStatus';
const friendList = {
    state: {
      friends:[], //好友列表，
      needTalk:'',//如果用户带参数打开程序，将参数作为正在聊天的好友
      selToID:'',
      friendHead:'',
      init:true,
      friendName:null,
      productId:""
    },
    mutations: {
      //添加好友
      ADD_FRIENDS: (state,friendsInfo) => {
        if(state.friends.length == 0){
          state.friends = state.friends.concat(friendsInfo);
        }else{
          for(var i in friendsInfo){
            var ind = state.friends.findIndex(item=>item.selToID === friendsInfo[i].selToID);
            if(ind === -1){
              state.friends.unshift(friendsInfo[i]);
              applyaddfriend(friendsInfo[i].selToID)
            }
          }
        }

      },
      //删除好友
      DEL_FRIEND: (state, friendId) =>{
        var i = state.friends.findIndex(item=>item.selToID === friendId);
        if(i !== -1){
          state.friends.splice(i,1);
        }
        console.log('删除好友暂未实现')
      },
      //更新好友
      UPDATE_FRIEND:(state, obj)=>{
        var i = state.friends.findIndex(item=>item.selToID === obj.selToID) 
        if(i !== -1){
          var oldInfo = state.friends[i];
          oldInfo.unRead = obj.unRead;
          //state.friends.splice(i,1,oldInfo)
            state.friends.splice(i,1);
            state.friends.unshift(oldInfo);
        }else{
          applyaddfriend(obj.selToID,true)
        }
      },
        //更新好友列表顺序
        UPDATE_FRIEND_ORDER:(state, obj)=>{
            //console.log('state.friends=====',state.friends);
            //console.log('obj.selToID=====',obj.selToID);
            var i = state.friends.findIndex(item=>item.selToID === obj.selToID);
            if(i !== -1){
                var oldInfo = state.friends[i];
                state.friends.splice(i,1);
                state.friends.unshift(oldInfo);
            }
        },
      //更新好友在线状态
      UPDATE_OFFLINE:(state, arr)=>{
        let j = 0, len = arr.length;
        for(; j < len; j++){
          var i = state.friends.findIndex(item=>item.selToID === arr[j].tbMemberId) 
          if(i !== -1){
            var offline = arr[j].state == 'offline';
            if(state.friends[i].offline !== offline){
               state.friends[i].offline = offline;
            }
          }
        }
      },
      //设置需要聊天的好友
      SET_NEEDTALK: (state, needTalk)=>{
        if(needTalk){
          state.needTalk = needTalk;
        }
        else{
          state.needTalk = '';
        }
      },
      //选择好友进行聊天
      SELECT_FRIEND:(state, friendId)=>{
        state.selToID = friendId;
        var friendIndex = state.friends.findIndex(item=>item.selToID == friendId)
        if(friendIndex === -1){
          state.friendHead = '';
        }else{
          state.friendHead = state.friends[friendIndex].headImage;
          state.friends[friendIndex].unRead = false;
        } 
        if(state.needTalk != ''){
          if(state.init){
            return;
          }
          state.needTalk = ''
        }
      },
      INIT_DONE:(state)=>{
        state.init = false;
      },
      GET_FRIENDNAME:(state, friendName)=>{
        state.friendName = friendName;
      },
      SET_PRODUCTID:(state, productId)=>{
        state.productId = productId
      }
    },
    actions: {
      add_friends: ({ commit ,state},friendsInfo) => {
        commit('ADD_FRIENDS',friendsInfo)
        if(state.needTalk != ''){
          commit('SELECT_FRIEND',state.needTalk);
        }
      },
      del_friends:({ commit },friendId)=>{
        commit('DEL_FRIEND',friendId)
      },
      update_friend:({ commit },obj)=>{
        commit('UPDATE_FRIEND',obj)
      },
       update_friend_order:({commit},obj)=>{
        commit('UPDATE_FRIEND_ORDER',obj);
      },
      set_needTalk:({ dispatch,commit, state}, needTalk)=>{
          var needTalks = needTalk.split(',')[0];
          var id = needTalk.split(',')[1];
          if(id){
            commit('SET_PRODUCTID', id);
          }
          if(-1 == state.friends.findIndex(item=>item.selToID === needTalks)){
            commit('SET_NEEDTALK',needTalks)
            applyaddfriend(needTalks)
          }else{
            dispatch('select_friend',needTalks)
          }
      },
      select_friend:({ dispatch,commit,state },friendId)=>{
        if(state.selToID === friendId ) return;
        commit('SELECT_FRIEND',friendId)
      },
      update_offline:({dispatch, commit}, arr)=>{
        commit('UPDATE_OFFLINE',arr)
      },
      check_needtalk:({ dispatch, commit, state})=>{
        if(state.needTalk != ''){
          applyaddfriend(state.needTalk);
          commit('INIT_DONE')
          commit('SELECT_FRIEND',state.needTalk);
          commit('SET_NEEDTALK')
        }
        setTimeout(function(){
          getUserStatus(state.friends)
        }, 2000);
        setInterval(function(){
            getUserStatus(state.friends)
        },1000*60);
      },
      getFriendName:({dispatch, commit, state}, friendName)=>{
        commit('GET_FRIENDNAME', friendName);
      }
    }
  };
  
  export default friendList;