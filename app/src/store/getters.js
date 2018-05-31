const getters = {
    getFrinds: state => state.friendList.friends,
    getFriendhead:(state,getters)=>(selToID)=>{
      var friendInfo = state.friendList.friends.find(item=>item.selToID == selToID)
      if(friendInfo){
        return friendInfo.headImage;
      }else{
        return '/images/1.jpg';
      }
    },
    getSelToID: state=>state.friendList.selToID,
    getMsg: (state)=>state.messageList.currentMsg,
    getMsgTrigger:(state)=>state.messageList.msgtrigger,
    getMsgTip:(state)=>state.messageList.msgTip,
    getSelfname:state=>state.card.selfname,
    getSelfhead:state=>state.card.selfhead,
    getMsgTransed:(state,getters)=>(uid)=>state.messageList.transed.get(uid),
    getTransLan:(state)=>state.transOption.transLan,
    getSend:(state)=>{
      var self = this;
      var data2 = JSON.parse(localStorage.getItem(state.card.selfname+'send'));

      if(data2){
        if(!(data2.cter && data2.Enter)){
          return false;
        }
      }
      return state.transOption.send;
    },
    getLan:(state)=>{
      return state.transOption.setLan
    },
    getFriendName:(state)=>state.friendList.friendName,
    getProductId:(state)=>state.friendList.productId,
    set_scrolltop:state=>state.messageList.scrollTop
  };
  export default getters