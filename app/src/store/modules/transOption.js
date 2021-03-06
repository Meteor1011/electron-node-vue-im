
//import Vue from 'vue'
const transOption = {
    state: {
      transLan:'中文',//要翻译的语言
      send:'true',
      setLan:'zh_TW'//系统语言
    },
    mutations: {
      //设置翻译的目标语言
      SET_TRANSLAN: (state, lan) =>{
       state.transLan = lan;
      },
      SET_SEND:(state,send) =>{//设置发送快捷键
        state.send = send;
      },
      SET_LAN:(state, lan) =>{
        //state.setLan = null;
        state.setLan = lan;
      }
    },
    actions: {
     setTransLan:({commit},lan)=>{
        commit("SET_TRANSLAN",lan)
     },
     setSend:({commit},send) =>{
       commit("SET_SEND", send);
     },
     setLan({commit}, lan){
        commit("SET_LAN", lan);
     }
    }
  };
  
  export default transOption;