import Vue from 'vue'
import VueRouter from 'vue-router'
//导入组件
import Index from '../views/Index'
import Register from '../views/Register'
import NoFind from '../views/404'
import Login from '../views/Login'
import Home from '../views/Home'
import InfoShow from '../views/InfoShow'
import FoundList from '../views/FoundList'
import Pie from '../views/Pie'
import BrokenLine from '../views/BrokenLine'
import AddNotes from '../views/AddNotes'
import FindNotes from '../views/FindNotes'
import Bill from '../views/Bill'

Vue.use(VueRouter)

const routes = [
  {path: '/', redirect: '/index'},
  {path: '/index', name: 'index', component:Index,children:[
      {path: '', component:Home},
      { path: '/home', name: 'home', component: Home },
      { path: '/infoshow', name: 'infoshow', component: InfoShow },
      { path: '/foundlist', name: 'foundlist', component: FoundList },
      { path: '/pie', name: 'pie', component: Pie },
      { path: '/brokenline', name: 'brokenline', component: BrokenLine },
      { path: '/addNotes', name: 'addNotes', component: AddNotes },
      { path: '/findNotes', name: 'findNotes', component: FindNotes },
      { path: '/bill', name: 'bill', component: Bill },
    ]},
  {path: '/register', name: 'register', component:Register},
  {path: '/login', name: 'login', component:Login},
  {path: '*', name: 'noFind', component:NoFind},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem('eleToken') ? true : false
  if (to.path === "/login" || to.path === "/register") {
    next()
  } else {
    isLogin ? next() : next("/login")
  }
})

export default router
