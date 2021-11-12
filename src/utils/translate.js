
// 封装百度翻译api
import Vue from 'vue'
import App from '../../src/App.vue'
import { MD5 } from '../utils/md5'
import store from '../store/index'
import * as axios from 'axios'
import { MessageBox , Loading  } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// from 传入参数为 String  -- 被转换的语言

// to 传入参数为 String  -- 需要转换的语言

// query 传入参数为 any类型  -- 内容
export let  translate = async function ( from , to , query ) {

    let appid = '20211103000990175'

    var  from =  from || 'zh'

    query || ''

    var  to  =  to || store.state.translateForm ||  'en'


    let salt = (new Date).getTime();

    let key = '8PNglftghKY_gs_cQecZ'

    // let loadingInstance = Loading.service('正在努力翻译中...');

    let sign = MD5(appid + query + salt + key)

    return await axios.get(`/baidu?q=${query}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`).then((res) => {
        // loadingInstance.close();
        console.log(res)
        if(res.status == 200){
            return  res.data.trans_result[0].dst
        }else{
            return '翻译出错啦，请稍后再试！'
        }
        
    })
}

