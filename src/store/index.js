import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const types = {
    SET_IS_AUTNENTIATED: 'SET_IS_AUTNENTIATED', // 是否认证通过
    SET_USER: 'SET_USER' // 用户信息
}

const state = { // 需要维护的状态
    isAutnenticated: false,  // 是否认证
    user: {}   // 存储用户信息
}
const getters = {
    isAutnenticated: state => state.isAutnenticated,
    user: state => state.user
}
const mutations = {
    [types.SET_IS_AUTNENTIATED](state, isAutnenticated) {
        if (isAutnenticated)
            state.isAutnenticated = isAutnenticated
        else
            state.isAutnenticated = false
    },
    [types.SET_USER](state, user) {
        if (user)
            state.user = user
        else
            state.user = {}
    }
}
//actions中方法的第一个参数：
//action函数可以接收一个与store实例具有相同方法的属性context 这个属性中包括下面几部分：
//context:{
//    state,   等同于store.$state，若在模块中则为局部状态
//    rootState,   等同于store.$state,只存在模块中
//    commit,   等同于store.$commit
//    dispatch,   等同于store.$dispatch
//    getters   等同于store.$getters 
//        }
//常规写法调用的时候会使用context.commit，但更多的是使用es6的变量解构赋值，也就是直接在参数的
//位置写自己想要的属性，如：{commit}。
const actions = {
    setIsAutnenticated: ({ commit }, isAutnenticated) => {
        commit(types.SET_IS_AUTNENTIATED, isAutnenticated)
    },
    setUser: ({ commit }, user) => {
        commit(types.SET_USER, user)
    },
    clearCurrentState: ({ commit }) => {
        commit(types.SET_IS_AUTNENTIATED, false)
        commit(types.SET_USER, null)
    }
}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})
