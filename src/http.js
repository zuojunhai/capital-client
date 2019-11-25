import axios from 'axios'
import router from './router/index'
import { Loading,Message } from 'element-ui'

//定义loading变量
let loading

////使用Element loading-start 方法
function startLoading() {
    //LoadingService 会返回一个 Loading 实例，可通过调用该实例的 close 方法来关闭它
    loading=Loading.service({
        lock:true,
        text:'正在加载...',
        background:'rgba(0,0,0,0.7)'
    })
}

////使用Element loading-close 方法
function endLoading() {
    loading.close()
}

//请求拦截 设置统一header
axios.interceptors.request.use(config=>{
    //加载
    startLoading()
    if(localStorage.getItem('eleToken')){
        config.headers.Authorization = localStorage.getItem('eleToken')
    }
    return config
},error=>{
    return Promise.reject(error)
})

//响应拦截 401 token过期处理
axios.interceptors.response.use(response=>{
    endLoading()
    return response
},error => {
    //错误提醒
    endLoading()
    Message.error(error.response.data)
    const { status } = error.response
    if(status===401){
        Message.error('token值无效，请重新登录')
        // 清除token
        localStorage.removeItem('eleToken')
        //页面跳转
        router.push('/login')
    }
    return Promise.reject(error)
})

export default axios