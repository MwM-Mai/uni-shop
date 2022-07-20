
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from "./store/store.js"

// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'

// 挂载到顶级的对象之上 uniapp 顶级对象是 uni
uni.$http = $http

// 请求的根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 如果在每次请求拦截之前显示 loading 效果 请求之后隐藏 loading 效果 就要使用 拦截器
// 请求拦截器 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  // 例如显示loading
  uni.showLoading({
      title: '数据加载中...',
    })
}

// 响应拦截器 请求完成之后做一些事情
$http.afterRequest = function () {
  // 隐藏loading效果
  uni.hideLoading()
}

// 封装显示消息的提示方法
uni.$showMsg = function (title = '数据加载失败!', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
    store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif