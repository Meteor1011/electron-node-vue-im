import localVersion from '../../../../package';
import getRemoteVersion from '../../util/getRemoteVersion'
const card = {
    state: {
      selfname:'',//用户昵称
      selfhead:'',//用户头像
      remoteVersion: localVersion.versionCode
    },
    mutations: {
      //用户信息
      SET_SELFINFO: (state,selfInfo) => {
          state.selfname = selfInfo.memberName;
          state.selfhead = selfInfo.headImage;
      },
      // 获取应用程序的远程版本信息
      GET_REMOTEVERSION(state, version){
        state.remoteVersion = version;
      }
    },
    actions: {
      set_selfInfo: ({ commit },selfInfo) => {
        commit('SET_SELFINFO',selfInfo)
      },
      get_remoteversion({commit, state}){
        return getRemoteVersion()
          .then(res => {
            if(res.data){
              commit('GET_REMOTEVERSION', res.data.versionNum)
            }
          })
      }
    }
  };
  
  export default card;