import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
// import info from './modules/userinfo'
const wsUrl = process.env.VUE_APP_WS_URL

Vue.use(Vuex)


const store = new Vuex.Store({
  
  state:{
    websocket:null,
    typeList: [{
      typeImg: require("../assets/image/tiktok.png"),
      name: "TikTok",
      typeId: 1,
    },
    ],
  
    //翻译类型
    translateForm: 'zh',
    // 
    messgeList: null,
    userInfo: {},
    myinfo: {
      //   myAvater:'https://img2.baidu.com/it/u=1296186069,911111491&fm=26&fmt=auto',
      //   name:"Reus"
    },

  },
  mutations:{
    newWebsocket(state,websocket){
      state.websocket = websocket
    },
    messgePushData:(state, newValue)=>{
      state.messgeList = newValue
    },
    //获取用户信息
    getUserInfo:(state, newValue)=>{
      console.log(state, newValue)
      state.userInfo = newValue

    },
    
    newData(state, newValue){
      state.messgeList = newValue
    },
    // 获取账号
    getMyInfo:(state, newValue)=>{
      console.log(newValue)
      state.myinfo = newValue
    },
  
    // 转换翻译
    setTranslateType:(state, newValue)=>{
      state.translateForm = newValue
    },

    // 清空用户信息
    deleteUserInfo(state){
      state.userInfo = {}
    }
  },

  actions:{
        // INIT_WEBSOCKET({commit}){
        //   commit('newWebsocket' , new WebSocket(wsUrl))

        //   const token = sessionStorage.getItem('userToken')

          
        // }
  },
  modules: {
    app,
    settings,
    user,
    // info
  },
  getters, 

  
})



export default store
