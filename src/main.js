import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './http'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

Vue.prototype.$axios=axios

Vue.config.productionTip = false

/*导入格式化时间的插件*/
import moment from 'moment'
/*定义一个全局过滤器*/
Vue.filter('dataFormat',function (dataStr,pattern = "YYYY-MM-DD HH:mm:ss") {
  return moment(dataStr).format(pattern)
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
